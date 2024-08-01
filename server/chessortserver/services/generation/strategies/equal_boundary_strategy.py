from ..move_selection_strategy import MoveSelectionStrategy
from ..helper.game_generation_helper import GameGenerationHelper
from ..helper.selection import Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move

class EqualBoundaryStrategy(MoveSelectionStrategy):
    """
    A strategy that selects moves at evenly spaced boundaries.
    For example, if num_required_moves is 4:
        The strategy will pick one move at each index percentages [0%, 33%, 66%, 100%].
    This ensures a good spread for selected values.
    """
    def can_handle(self, moves: list[Move], num_required_moves: int) -> bool:
        # Strategy requires at least 2 required moves.
        if num_required_moves < 2:
            return False
        return super().can_handle(moves, num_required_moves)

    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        if not self.can_handle(moves, num_required_moves):
            raise ValueError('Cannot handle input. Make sure you call can_handle() first.')

        # Get smart buckets
        ggh = GameGenerationHelper(moves)

        # Create boundary and selections
        selections = [
            Selection(
                start=(i / (num_required_moves - 1)),
                end=((i + 1) / (num_required_moves - 1)),
            ) for i in range(num_required_moves)
        ]
        selections[-1].end = (num_required_moves - 2) / (num_required_moves - 1) # correct the last entry

        # Get all the moves we need
        selected_moves = [ggh.select_move(selection) for selection in selections]

        if len(selected_moves) != num_required_moves:
            # This should never happen!
            raise GameGenerationError("Failed to generate required number of moves.")

        return selected_moves
