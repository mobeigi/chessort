import random

from chessortserver.services.generation.exception.game_generation_error import GameGenerationError
from chessortserver.services.generation.strategies.equal_random_segments_strategy import EqualRandomSegmentsStrategy
from .strategies.top_strongest_strategy import TopStrongestStrategy
from ...models.models import Move
from ...logger import Logger
from .move_selection_strategy import MoveSelectionStrategy

class GameCurator:
    """
    Responsible for curating interesting games.
    """
    def __init__(self) -> None:
        self.strategies: list[MoveSelectionStrategy] = [
            EqualRandomSegmentsStrategy(),
            TopStrongestStrategy(distinct=True),
        ]

        # Set fallback to a strategy that will always succeed!
        self.fallback_strategy = TopStrongestStrategy(distinct=False)
        
        self.logger = Logger('chessortserver').getLogger()
    
    def select_moves_for_game(self, all_moves: list[Move], num_required_moves:int) -> list[Move]:
        # Filter strategies that are capable
        capable_strategies = [strategy for strategy in self.strategies if strategy.can_handle(all_moves, num_required_moves)]
        
        # Pick a random strategy from the list
        if len(capable_strategies) > 0:
            selected_strategy = random.choice(capable_strategies)
        else:
            selected_strategy = self.fallback_strategy
        
        # Try to generate moves for a game
        selected_moves = []
        try:
            selected_moves = selected_strategy.select_moves(all_moves, num_required_moves)
        except GameGenerationError:
            try:
                # Strategy failed, use fallback
                selected_moves = self.fallback_strategy.select_moves(all_moves, num_required_moves)
                self.logger.warn(f"Strategy failed to generate game. Strategy: {selected_strategy.__class__}. Moves: {all_moves}. num_required_moves: {num_required_moves}")
            except GameGenerationError:
                self.logger.error(f"Fallback strategy failed to generate game. Moves: {all_moves}. num_required_moves: {num_required_moves}")

        return selected_moves
