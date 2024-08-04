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

    def __str__(self):
        return f"TopStrongestStrategy(distinct={self.distinct})"

    def __repr__(self):
        return self.__str__()

    def can_handle(self, position, moves: list[Move], num_required_moves: int) -> bool:
        if not self.distinct:
            if len(moves) < num_required_moves:
                return False
        else:
            # Need at least num_required_moves buckets
            ggh = GameGenerationHelper(position, moves)
            if len(ggh.smart_bucket) < num_required_moves:
                return False
        
        return super().can_handle(position, moves, num_required_moves)

    def select_moves(self, position, moves: list[Move], num_required_moves: int) -> list[Move]:
        if not self.can_handle(position, moves, num_required_moves):
            raise ValueError('Cannot handle input. Make sure you call can_handle() first.')

        # Top N moves
        if not self.distinct:
            return moves[:num_required_moves]

        # Get smart buckets
        ggh = GameGenerationHelper(position, moves)

        # Create selections
        selections = [
            Selection(start=0.0, end=1.0, max_bucket_usage_count=1) for _ in range(num_required_moves)
        ]

        # Get all the moves we need
        selected_moves = [ggh.select_move(selection) for selection in selections]

        if len(selected_moves) != num_required_moves:
            # This should never happen!
            raise GameGenerationError("Failed to generate required number of moves.")

        sorted_selected_moves = sorted(selected_moves, key=lambda x: x.engine_overall_rank)
        return sorted_selected_moves
