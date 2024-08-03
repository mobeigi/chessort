from ..move_selection_strategy import MoveSelectionStrategy
from ..helper.game_generation_helper import GameGenerationHelper
from ..helper.selection import Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move

class TopStrongestStrategy(MoveSelectionStrategy):
    """
    A strategy that selects the top N strongest moves.
    Supports ability to return distinct evaluations.
    """
    
    def __init__(self, distinct: bool = True):
        self.distinct = distinct

    def can_handle(self, moves: list[Move], num_required_moves: int) -> bool:
        if not self.distinct:
            if len(moves) < num_required_moves:
                return False
        else:
            # Need at least num_required_moves buckets
            ggh = GameGenerationHelper(moves)
            if ggh.smart_bucket.size < num_required_moves:
                return False
        
        return super().can_handle(moves, num_required_moves)

    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        if not self.can_handle(moves, num_required_moves):
            raise ValueError('Cannot handle input. Make sure you call can_handle() first.')

        # Top N moves
        if not self.distinct:
            return moves[:num_required_moves]

        # Get smart buckets
        ggh = GameGenerationHelper(moves)

        # Create selections
        selections = [
            Selection(start=0.0, end=1.0, max_bucket_usage_count=1) for _ in range(num_required_moves)
        ]

        # Get all the moves we need
        selected_moves = [ggh.select_move(selection) for selection in selections]

        if len(selected_moves) != num_required_moves:
            # This should never happen!
            raise GameGenerationError("Failed to generate required number of moves.")

        return selected_moves
