from chessortserver.models.chess import Color, EvaluationType
from ..move_selection_strategy import MoveSelectionStrategy
from ..helper.game_generation_helper import GameGenerationHelper
from ..helper.selection import SearchMethod, Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move

class OneOfEachStrategy(MoveSelectionStrategy):
    """
    A strategy which returns exactly one of each evaluation type and advantage.
    Returns 1 mate for white move, 1 positive centipawn move (or neutral), 1 negative centipawn move, 1 mate for black move.
    """
    def can_handle(self, moves: list[Move], num_required_moves: int) -> bool:
        if num_required_moves != 4:
            return False
        
        # Ensure there exists at least 1 move of each evaluation type
        has_mate_for_white = False
        has_centipawn_for_white = False
        has_centipawn_for_black = False
        has_mate_for_black = False

        ggh = GameGenerationHelper(moves)
        for bucket in ggh.smart_bucket:
            if bucket.advantage == Color.WHITE:
                if bucket.evaluation_type == EvaluationType.MATE:
                    has_mate_for_white = True
                elif bucket.evaluation_type == EvaluationType.CENTIPAWN:
                    has_centipawn_for_white = True
            elif bucket.advantage == Color.BLACK:
                if bucket.evaluation_type == EvaluationType.MATE:
                    has_mate_for_black = True
                elif bucket.evaluation_type == EvaluationType.CENTIPAWN:
                    has_centipawn_for_black = True
            elif bucket.advantage == Color.NEUTRAL: # We can also treat a neutral as white
                has_centipawn_for_white = True
            
        if not has_mate_for_white or not has_centipawn_for_white or not has_centipawn_for_black or not has_mate_for_black:
            return False
        
        return super().can_handle(moves, num_required_moves)

    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        if not self.can_handle(moves, num_required_moves):
            raise ValueError('Cannot handle input. Make sure you call can_handle() first.')

        ggh = GameGenerationHelper(moves)

        selections = [
            Selection(start=0.0, end=1.0, search_method=SearchMethod.RANDOM, evaluation_type=EvaluationType.MATE, advantage=[Color.WHITE]),
            Selection(start=0.0, end=1.0, search_method=SearchMethod.RANDOM, evaluation_type=EvaluationType.CENTIPAWN, advantage=[Color.WHITE, Color.NEUTRAL]),
            Selection(start=0.0, end=1.0, search_method=SearchMethod.RANDOM, evaluation_type=EvaluationType.CENTIPAWN, advantage=[Color.BLACK]),
            Selection(start=0.0, end=1.0, search_method=SearchMethod.RANDOM, evaluation_type=EvaluationType.MATE, advantage=[Color.BLACK]),
        ]

        # Get all the moves we need
        selected_moves = [ggh.select_move(selection) for selection in selections]

        if len(selected_moves) != num_required_moves:
            # This should never happen!
            raise GameGenerationError("Failed to generate required number of moves.")
    
        sorted_selected_moves = sorted(selected_moves, key=lambda x: x.engine_overall_rank)
        return sorted_selected_moves
