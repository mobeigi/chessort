import pytest

from chessortserver.services.generation.strategies.dual_sided_duplicate_strategy import DualSidedDuplicateStrategy
from chessortserver.models.models import Move

from fixtures.fixtures import random_move

left = 2
right = 2
total = left + right
strategy = DualSidedDuplicateStrategy(left=left, right=right)

def test_insufficient_moves():
    moves = [ random_move(engine_overall_rank=rank+1) for rank in range(10) ]
    with pytest.raises(ValueError):
        strategy.select_moves(moves, total - 1)

def test_can_handle_insufficient_moves_buckets():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="#1", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="#-3", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="#-4", engine_overall_rank=4),
     ]
    assert len(moves) == 4
    assert not strategy.can_handle(moves=moves, num_required_moves=4)

def test_can_handle_no_reuse():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="#2", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="+500", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="+500", engine_overall_rank=4),
        Move(id=5, position_id=1, uci_move="uci5", engine_eval="#-2", engine_overall_rank=5),
        Move(id=6, position_id=1, uci_move="uci6", engine_eval="#-1", engine_overall_rank=6),
     ]
    assert len(moves) == 6
    assert not strategy.can_handle(moves=moves, num_required_moves=4)

def _test_helper(moves: list[Move], num_required_moves: int, expected_indexes: list[int]) -> list[Move]:
    game_moves = strategy.select_moves(moves, num_required_moves)
    assert len(game_moves) == num_required_moves
    assert [game_move in moves for game_move in game_moves]

    # Ensure ordering is correct
    assert len(expected_indexes) == num_required_moves
    for i in range(num_required_moves):
        assert game_moves[i] == moves[expected_indexes[i]]

def test_dual_sided_duplicate_strategy():
    moves = [ 
        Move(id=1, position_id=1, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=1, uci_move="uci2", engine_eval="#1", engine_overall_rank=2),
        Move(id=3, position_id=1, uci_move="uci3", engine_eval="#-1", engine_overall_rank=3),
        Move(id=4, position_id=1, uci_move="uci4", engine_eval="#-1", engine_overall_rank=4),
     ]
    assert len(moves) == 4
    _test_helper(moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
