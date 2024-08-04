from chessortserver.models.chess import Color
from chessortserver.utils.engine.strength import normalised_strength
from chessortserver.utils.chess import get_turn_player_from_fen
from ..move_selection_strategy import MoveSelectionStrategy
from ..helper.game_generation_helper import GameGenerationHelper
from ..helper.selection import Selection
from ..exception.game_generation_error import GameGenerationError
from ....models.models import Move, Position

class TopSpreadStrategy(MoveSelectionStrategy):
    """
    A strategy that always picks the top move, then the next distict top moves while enforcing a minimum normalised spread.
    """

    def __init__(self, normalised_spread: float = 0.0):
        self.normalised_spread = normalised_spread

    def __str__(self):
        return f"TopSpreadStrategy(normalised_spread={self.normalised_spread})"

    def __repr__(self):
        return self.__str__()

    def can_handle(self, position: Position, moves: list[Move], num_required_moves: int) -> bool:
        # Need at least num_required_moves buckets
        ggh = GameGenerationHelper(position, moves)
        if len(ggh.smart_bucket) < num_required_moves:
            return False
        
        return super().can_handle(position, moves, num_required_moves)

    def select_moves(self, position: Position, moves: list[Move], num_required_moves: int) -> list[Move]:
        if not self.can_handle(position, moves, num_required_moves):
            raise ValueError('Cannot handle input. Make sure you call can_handle() first.')

        # Get smart buckets
        ggh = GameGenerationHelper(position, moves)

        selected_moves = []
        max_norm_eval_strength = None # Initially we don't care about strength
        turn_player = get_turn_player_from_fen(position.fen)

        for _ in range(num_required_moves):
            selection = Selection(start=0.0, end=1.0, max_bucket_usage_count=1, max_norm_eval_strength=max_norm_eval_strength)
            move = ggh.select_move(selection)
            selected_moves.append(move)

            # Compute new acceptable max_norm_eval_strength based on last picked move
            relative_normalised_strength = normalised_strength([move.engine_eval], turn_player)[0]
            max_norm_eval_strength = relative_normalised_strength - self.normalised_spread
        
        if len(selected_moves) != num_required_moves:
            # This should never happen!
            raise GameGenerationError("Failed to generate required number of moves.")
        
        sorted_selected_moves = sorted(selected_moves, key=lambda x: x.engine_overall_rank)
        return sorted_selected_moves
