import random
from ..strategy import Strategy
from ....models.models import Move

class RandomStrategy(Strategy):
    def select_moves(self, moves: list[Move], num_required_moves: int) -> list[Move]:
        return random.sample(moves, num_required_moves)
