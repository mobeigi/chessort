from collections import defaultdict

from chessortserver.services.generation.exception.game_generation_error import GameGenerationError
from chessortserver.services.generation.strategies.top_spread_strategy import TopSpreadStrategy
from .strategies.top_strongest_strategy import TopStrongestStrategy
from ...models.models import Move, Position
from ...logger import Logger
from .move_selection_strategy import MoveSelectionStrategy
from ...utils.engine.strength import normalised_strength

class GameCurator:
    """
    Responsible for curating interesting games.
    """
    def __init__(self) -> None:
        self.strategy_groups: dict[str, list[MoveSelectionStrategy]] = {
            'Beginner': [
                TopSpreadStrategy(normalised_spread=self._eval_to_normalised_spread('+500'))
            ],
            'Easy': [
                TopSpreadStrategy(normalised_spread=self._eval_to_normalised_spread('+300'))
            ],
            'Medium': [
                TopSpreadStrategy(normalised_spread=self._eval_to_normalised_spread('+150'))
            ],
            'Hard': [
                TopSpreadStrategy(normalised_spread=self._eval_to_normalised_spread('+50'))
            ],
            'Master': [
                # A spread of 0 essentially picks the top N distinct moves, if they exist
                # Therefore, strategy will not fail assuming enough distinct moves exist
                TopSpreadStrategy(normalised_spread=self._eval_to_normalised_spread('0'))
            ],
        }
        
        # Initialize usage tracking
        self.group_usage: defaultdict[str, int] = defaultdict(int)
        self.strategy_usage: defaultdict[type[MoveSelectionStrategy], int] = defaultdict(int)

        # Set fallback to a strategy that will always succeed!
        self.fallback_strategy = TopStrongestStrategy(distinct=False)
        
        self.logger = Logger('chessortserver').getLogger()

    def _eval_to_normalised_spread(self, eval: str) -> float:
        return normalised_strength([eval])[0] - 0.5

    def select_moves_for_game(self, position: Position, all_moves: list[Move], num_required_moves: int) -> list[Move]:
        # We employ a fair pick strategy based on usage to ensure no strategies are starved
        selected_moves = []

        # Filter strategies that are capable and organize by groups
        capable_groups: dict[str, list[type[MoveSelectionStrategy]]] = {}
        for group, strategies in self.strategy_groups.items():
            capable_strategies = [s for s in strategies if s.can_handle(position, all_moves, num_required_moves)]
            if capable_strategies:
                capable_groups[group] = capable_strategies
        
        # Pick least used group and least used strategy until exhaustion
        while len(capable_groups) > 0:
            least_used_group = min(capable_groups, key=lambda g: self.group_usage[g])
            strategies = capable_groups[least_used_group]

            while len(strategies) > 0:
                least_used_strategy = min(strategies, key=lambda s: self.strategy_usage[s])
                try:
                    selected_moves = least_used_strategy.select_moves(position, all_moves, num_required_moves)
                    self.group_usage[least_used_group] += 1
                    self.strategy_usage[least_used_strategy] += 1
                    return selected_moves
                except GameGenerationError as e:
                    strategies.remove(least_used_strategy)
            
            # Remove the group if all strategies within it fail
            del capable_groups[least_used_group]
        
        # Use fallback if all strategies failed
        self.logger.warn(f"All strategies in all groups failed. Using fallback: {self.fallback_strategy}. Moves: {all_moves}. num_required_moves: {num_required_moves}")
        try:
            selected_moves = self.fallback_strategy.select_moves(position, all_moves, num_required_moves)
        except GameGenerationError as e:
            self.logger.error(f"Fallback strategy failed to generate game. Moves: {all_moves}. num_required_moves: {num_required_moves}")
            self.logger.error(e)

        return selected_moves
