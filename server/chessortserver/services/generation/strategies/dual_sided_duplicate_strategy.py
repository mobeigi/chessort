from chessortserver.models.chess import Color, EvaluationType
from ..move_selection_strategy import MoveSelectionStrategy
from ..helper.game_generation_helper import GameGenerationHelper
from ..helper.selection import SearchMethod, Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move

class DualSidedDuplicateStrategy(MoveSelectionStrategy):
    """
    A strategy which picks a number of the same evaluation moves from one side and 
    another number of same evaluation moves from the other side.
    """

    def __init__(self, left: int, right: int):
        self.left = left
        self.right = right
    
    def can_handle(self, moves: list[Move], num_required_moves: int) -> bool:
        if num_required_moves != self.left + self.right:
            return False
        
        # Ensure there exists at least 2 buckets of each required size
        ggh = GameGenerationHelper(moves)

        if len(ggh.smart_bucket) < 2:
            return False
        
        can_support_left = False
        can_support_right = False
        for bucket in ggh.smart_bucket:
            if not can_support_left and len(bucket) >= self.left:
                can_support_left = True
            elif not can_support_right and len(bucket) >= self.right:
                can_support_right = True
            if can_support_left and can_support_right:
                break

        if not can_support_left or not can_support_right:
            return False
        
        return super().can_handle(moves, num_required_moves)

    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        if not self.can_handle(moves, num_required_moves):
            raise ValueError('Cannot handle input. Make sure you call can_handle() first.')

        ggh = GameGenerationHelper(moves)

        left_selections = self.left * [Selection(start=0.0, end=1.0, search_method=SearchMethod.TRAVERSAL, min_bucket_size=self.left)]
        right_selections = self.right * [Selection(start=1.0, end=0.0, search_method=SearchMethod.TRAVERSAL, min_bucket_size=self.right)]

        selections = left_selections + right_selections

        # Get all the moves we need
        selected_moves = [ggh.select_move(selection) for selection in selections]

        if len(selected_moves) != num_required_moves:
            # This should never happen!
            raise GameGenerationError("Failed to generate required number of moves.")
    
        sorted_selected_moves = sorted(selected_moves, key=lambda x: x.engine_overall_rank)
        return sorted_selected_moves
