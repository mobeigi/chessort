import pytest

from chessortserver.services.generation.strategies.equal_boundary_strategy import EqualBoundaryStrategy
from chessortserver.services.generation.exception.game_generation_error import GameGenerationError
from chessortserver.models.models import Move

from fixtures.fixtures import random_move

equal_boundary_strategy = EqualBoundaryStrategy()

def test_insufficient_moves_required():
    moves = [ random_move(engine_overall_rank=rank + 1) for rank in range(2) ]
    assert len(moves) == 2
    
    with pytest.raises(ValueError):
        equal_boundary_strategy.select_moves(moves, 0)

    with pytest.raises(ValueError):
        equal_boundary_strategy.select_moves(moves, 1)

def test_can_handle_insufficient_moves_buckets():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="#1", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="#2", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="#2", engine_overall_rank=4),
        Move(id=5, position_id=1, uci_move="uci5", engine_eval="#3", engine_overall_rank=5),
        Move(id=6, position_id=1, uci_move="uci5", engine_eval="#3", engine_overall_rank=6),
     ]
    assert len(moves) == 6
    
    # Can handle, enough buckets
    assert equal_boundary_strategy.can_handle(moves=moves, num_required_moves=3)

    # Cannot handle, not enough buckets
    assert not equal_boundary_strategy.can_handle(moves=moves, num_required_moves=4)

def test_insufficient_moves():
    moves = []
    assert len(moves) == 0
    
    with pytest.raises(ValueError):
        equal_boundary_strategy.select_moves(moves, 1)
    
    # 2 moves
    moves = [ random_move(engine_overall_rank=rank + 1) for rank in range(2) ]

    with pytest.raises(ValueError):
        equal_boundary_strategy.select_moves(moves, len(moves) + 1)

def _test_helper(num_moves_to_pick_from: int, num_required_moves: int, expected_indexes: list[int]) -> list[Move]:
    # Get moves to pick from
    moves = [ random_move(engine_overall_rank=rank + 1) for rank in range(num_moves_to_pick_from) ]
    assert len(moves) == num_moves_to_pick_from
    
    game_moves = equal_boundary_strategy.select_moves(moves, num_required_moves)
    assert len(game_moves) == num_required_moves
    assert [game_move in moves for game_move in game_moves]

    # Ensure boundaries are correct
    assert len(expected_indexes) == num_required_moves
    for i in range(num_required_moves):
        assert game_moves[i] == moves[expected_indexes[i]]

def test_two_move_required():
    _test_helper(num_moves_to_pick_from=2, num_required_moves=2, expected_indexes=[0,1])
    _test_helper(num_moves_to_pick_from=4, num_required_moves=2, expected_indexes=[0,3])
    _test_helper(num_moves_to_pick_from=10, num_required_moves=2, expected_indexes=[0,9])

def test_four_moves_required():
    _test_helper(num_moves_to_pick_from=4, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(num_moves_to_pick_from=10, num_required_moves=4, expected_indexes=[0,3,6,9])
    _test_helper(num_moves_to_pick_from=17, num_required_moves=4, expected_indexes=[0,5,11,16])
