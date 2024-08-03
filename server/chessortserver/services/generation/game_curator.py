from collections import defaultdict
import random

from chessortserver.services.generation.exception.game_generation_error import GameGenerationError
from chessortserver.services.generation.strategies.dual_sided_duplicate_strategy import DualSidedDuplicateStrategy
from chessortserver.services.generation.strategies.equal_random_segments_strategy import EqualRandomSegmentsStrategy
from chessortserver.services.generation.strategies.one_of_each_strategy import OneOfEachStrategy
from .strategies.top_strongest_strategy import TopStrongestStrategy
from ...models.models import Move
from ...logger import Logger
from .move_selection_strategy import MoveSelectionStrategy

class GameCurator:
    """
    Responsible for curating interesting games.
    """
    def __init__(self) -> None:
        self.strategy_groups: dict[str, list[MoveSelectionStrategy]] = {
            'EqualRandomSegments': [
                EqualRandomSegmentsStrategy(),
            ],
            'OneOfEach': [
                OneOfEachStrategy(),
            ],
            'DualSidedDuplicates': [
                DualSidedDuplicateStrategy(left=1, right=3),
                DualSidedDuplicateStrategy(left=2, right=2),
                DualSidedDuplicateStrategy(left=3, right=1),
            ],
            'Top4': [
                TopStrongestStrategy(distinct=True),
            ]
        }

        # Initialize usage tracking
        self.group_usage = defaultdict(int)
        self.strategy_usage = defaultdict(int)

        # Set fallback to a strategy that will always succeed!
        self.fallback_strategy = TopStrongestStrategy(distinct=False)
        
        self.logger = Logger('chessortserver').getLogger()
    
    def select_moves_for_game(self, all_moves: list[Move], num_required_moves:int) -> list[Move]:
        # Filter strategies that are capable and organize by groups
        capable_groups = {}
        for group, strategies in self.strategy_groups.items():
            capable_strategies = [s for s in strategies if s.can_handle(all_moves, num_required_moves)]
            if capable_strategies:
                capable_groups[group] = capable_strategies

        # Pick the least used group and then the least used strategy within that group
        if capable_groups:
            least_used_group = min(capable_groups, key=lambda g: self.group_usage[g])
            selected_strategy = min(capable_groups[least_used_group], key=lambda s: self.strategy_usage[s])
            self.group_usage[least_used_group] += 1
            self.strategy_usage[selected_strategy] += 1
        else:
            self.logger.warn(f"No capable strategy found. Using fallback: {self.fallback_strategy.__class__}. Moves: {all_moves}. num_required_moves: {num_required_moves}")
            selected_strategy = self.fallback_strategy
        
        # Try to generate moves for a game using our selected strategy
        selected_moves = []
        try:
            selected_moves = selected_strategy.select_moves(all_moves, num_required_moves)
        except GameGenerationError as e:
            try:
                # Strategy failed, use fallback
                self.logger.warn(f"Strategy failed to generate game. Strategy: {selected_strategy.__class__}. Using fallback: {self.fallback_strategy.__class__}. Moves: {all_moves}. num_required_moves: {num_required_moves}")
                self.logger.warn(e)
                selected_moves = self.fallback_strategy.select_moves(all_moves, num_required_moves)
            except GameGenerationError as e:
                self.logger.error(f"Fallback strategy failed to generate game. Moves: {all_moves}. num_required_moves: {num_required_moves}")
                self.logger.error(e)

        return selected_moves
