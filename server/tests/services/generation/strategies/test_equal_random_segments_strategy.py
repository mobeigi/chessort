import pytest

from chessortserver.services.generation.strategies.equal_random_segments_strategy import EqualRandomSegmentsStrategy
from chessortserver.services.generation.exception.game_generation_error import GameGenerationError
from chessortserver.models.models import Move

from fixtures.fixtures import random_move

strategy = EqualRandomSegmentsStrategy()

def test_one_num_required_moves():
    moves = [ random_move(engine_overall_rank=rank + 1) for rank in range(1) ]
    assert len(moves) == 1
    game_moves = strategy.select_moves(moves, 1)
    assert len(game_moves) == len(moves)

def test_insufficient_moves():
    moves = [ random_move(engine_overall_rank=rank + 1) for rank in range(2) ]
    with pytest.raises(ValueError):
        strategy.select_moves(moves, len(moves) + 1)

def test_can_handle_insufficient_moves_buckets():
    # moves that turn into 3 buckets
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
    assert strategy.can_handle(moves=moves, num_required_moves=1)
    assert strategy.can_handle(moves=moves, num_required_moves=2)
    assert strategy.can_handle(moves=moves, num_required_moves=3)

    # Cannot handle, not enough buckets
    assert not strategy.can_handle(moves=moves, num_required_moves=4)
    assert not strategy.can_handle(moves=moves, num_required_moves=5)

def _test_helper(moves: list[Move], num_required_moves: int, expected_ids: list[list[int]]) -> list[Move]:
    game_moves = strategy.select_moves(moves, num_required_moves)
    assert len(game_moves) == num_required_moves
    assert [game_move in moves for game_move in game_moves]

    # Ensure ordering is correct
    assert len(expected_ids) == num_required_moves
    for i in range(num_required_moves):
        assert game_moves[i].id in expected_ids[i]

def test_equal_random_segment_strategy():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="#2", engine_overall_rank=2),

        Move(id=3, position_id=1, uci_move="uci3", engine_eval="+200", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="+200", engine_overall_rank=4),

        Move(id=5, position_id=1, uci_move="uci5", engine_eval="0", engine_overall_rank=5),
        Move(id=6, position_id=1, uci_move="uci6", engine_eval="0", engine_overall_rank=6),
        Move(id=7, position_id=1, uci_move="uci7", engine_eval="0", engine_overall_rank=7),

        Move(id=8, position_id=1, uci_move="uci8", engine_eval="-16", engine_overall_rank=8),
        Move(id=9, position_id=1, uci_move="uci9", engine_eval="-16", engine_overall_rank=9),
     ]
    assert len(moves) == 9

    _test_helper(moves=moves, num_required_moves=2, expected_ids=[[1,2,3,4], [5,6,7,8,9]])
    _test_helper(moves=moves, num_required_moves=4, expected_ids=[[1], [2,3,4], [5,6,7], [8,9]])

def test_equal_random_segment_strategy_2():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="#2", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="+200", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="0", engine_overall_rank=4),
     ]
    assert len(moves) == 4

    _test_helper(moves=moves, num_required_moves=2, expected_ids=[[1,2], [3,4]])
    _test_helper(moves=moves, num_required_moves=4, expected_ids=[[1], [2], [3], [4]])
