import random
from ..move_selection_strategy import MoveSelectionStrategy
from ....models.models import Move

class RandomStrategy(MoveSelectionStrategy):
    """
    A strategy which simply picks the number of required moves randomly.
    """
    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        selected_moves = random.sample(moves, num_required_moves)
        sorted_selected_moves = sorted(selected_moves, key=lambda x: x.engine_overall_rank)
        return sorted_selected_moves
