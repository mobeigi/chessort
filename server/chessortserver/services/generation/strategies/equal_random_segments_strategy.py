from ..move_selection_strategy import MoveSelectionStrategy
from ..helper.game_generation_helper import GameGenerationHelper
from ..helper.selection import SearchMethod, Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move

class EqualRandomSegmentsStrategy(MoveSelectionStrategy):
    """
    A strategy that selects moves randomly from equally sized segments.
    In other words, it splits up bucketed moves into num_required_moves segments 
    and picks a move random move from each segment.
    """
    def can_handle(self, moves: list[Move], num_required_moves: int) -> bool:
        # Need at least num_required_moves buckets
        ggh = GameGenerationHelper(moves)
        if ggh.smart_bucket.size < num_required_moves:
            return False
        
        return super().can_handle(moves, num_required_moves)

    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        if not self.can_handle(moves, num_required_moves):
            raise ValueError('Cannot handle input. Make sure you call can_handle() first.')
        
        if num_required_moves <= 1:
            return moves

        ggh = GameGenerationHelper(moves)

        # Bounds defined by 1 / n
        selections = [
            Selection(
                start=(i / num_required_moves),
                end=((i+1) / num_required_moves),
                search_method=SearchMethod.RANDOM,
            ) for i in range(num_required_moves)
        ]

        # Get all the moves we need
        selected_moves = [ggh.select_move(selection) for selection in selections]

        if len(selected_moves) != num_required_moves:
            # This should never happen!
            raise GameGenerationError("Failed to generate required number of moves.")
    
        return selected_moves
