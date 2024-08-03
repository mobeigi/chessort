import pytest

from chessortserver.services.generation.strategies.one_of_each_strategy import OneOfEachStrategy
from chessortserver.services.generation.exception.game_generation_error import GameGenerationError
from chessortserver.models.models import Move

from fixtures.fixtures import random_move

strategy = OneOfEachStrategy()

def test_insufficient_moves():
    moves = [ random_move(engine_overall_rank=rank+1) for rank in range(10) ]
    with pytest.raises(ValueError):
        strategy.select_moves(moves, 3)
    with pytest.raises(ValueError):
        strategy.select_moves(moves, 5)

def test_can_handle_insufficient_moves_buckets():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="+500", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="-500", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="-700", engine_overall_rank=4),
     ]
    assert len(moves) == 4
    assert not strategy.can_handle(moves=moves, num_required_moves=4)

def _test_helper(moves: list[Move], num_required_moves: int, expected_indexes: list[int]) -> list[Move]:
    game_moves = strategy.select_moves(moves, num_required_moves)
    assert len(game_moves) == num_required_moves
    assert [game_move in moves for game_move in game_moves]

    # Ensure ordering is correct
    assert len(expected_indexes) == num_required_moves
    for i in range(num_required_moves):
        assert game_moves[i] == moves[expected_indexes[i]]

def test_one_of_each_strategy():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="+500", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="-500", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="#-1", engine_overall_rank=4),
     ]
    assert len(moves) == 4
    _test_helper(moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])

def test_one_of_each_strategy_with_neutral():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="0", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="-500", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="#-1", engine_overall_rank=4),
     ]
    assert len(moves) == 4
    _test_helper(moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
