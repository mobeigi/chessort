import random
from .strategies.equal_boundary_strategy import EqualBoundaryStrategy
from .strategies.top_strongest_strategy import TopStrongestStrategy
from .strategies.random_strategy import RandomStrategy
from ...models.models import Move

class GameCurator:
    """
    Responsible for curating interesting games.
    """
    def __init__(self) -> None:
        self.strategies = [
            EqualBoundaryStrategy(),
            TopStrongestStrategy(distinct=True),
        ]

        self.fallback_strategy = RandomStrategy()
    
    def select_moves_for_game(self, all_moves: list[Move], num_required_moves:int) -> list[Move]:
        # Filter strategies that are capable
        capable_strategies = [strategy for strategy in self.strategies if strategy.can_handle(all_moves, num_required_moves)]
        
        # Pick a random strategy from the list
        if len(capable_strategies) > 0:
            selected_strategy = random.choice(capable_strategies)
        else:
            selected_strategy = self.fallback_strategy

        # TODO: Should bucket strategies into ones likely to produce different difficulty games
        
        # Generate the game using the selected strategy
        return selected_strategy.select_moves(all_moves, num_required_moves)
