import random
from .strategies.equal_boundary_strategy import EqualBoundaryStrategy
from ...models.models import Move

class GameCurator:
    """
    Responsible for curating interesting games.
    """
    def __init__(self) -> None:
        self.strategies = [
            EqualBoundaryStrategy() 
        ]
    
    def select_moves_for_game(self, all_moves: list[Move], num_required_moves:int) -> list[Move]:
        # Pick a random strategy from the list
        # TODO: Should bucket strategies into ones likely to produce different difficulty games
        selected_strategy = random.choice(self.strategies)
        
        # Generate the game using the selected strategy
        return selected_strategy.select_moves(all_moves, num_required_moves)
