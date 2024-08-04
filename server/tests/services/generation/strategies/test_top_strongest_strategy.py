import pytest

from chessortserver.services.generation.strategies.top_strongest_strategy import TopStrongestStrategy
from chessortserver.models.models import Move

from fixtures.fixtures import random_move

position = '' # TODO: use fixture
strategy_distinct = TopStrongestStrategy(distinct=True)
strategy_not_distinct = TopStrongestStrategy(distinct=False)

def test_distinct_can_handle_insufficient_moves_buckets():
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
    assert strategy_distinct.can_handle(position=position, moves=moves, num_required_moves=1)
    assert strategy_distinct.can_handle(position=position, moves=moves, num_required_moves=2)
    assert strategy_distinct.can_handle(position=position, moves=moves, num_required_moves=3)

    # Cannot handle, not enough buckets
    assert not strategy_distinct.can_handle(position=position, moves=moves, num_required_moves=4)

def test_insufficient_moves():
    moves = []
    assert len(moves) == 0
    
    with pytest.raises(ValueError):
        strategy_distinct.select_moves(position, moves, 1)
        strategy_not_distinct.select_moves(position, moves, 1)
    
    # 2 moves
    moves = [ random_move(engine_overall_rank=rank + 1) for rank in range(2) ]

    with pytest.raises(ValueError):
        strategy_distinct.select_moves(position, moves, len(moves) + 1)
        strategy_not_distinct.select_moves(position, moves, len(moves) + 1)


def _test_helper(strategy: TopStrongestStrategy, moves: list[Move], num_required_moves: int, expected_indexes: list[int]) -> list[Move]:
    game_moves = strategy.select_moves(position, moves, num_required_moves)
    assert len(game_moves) == num_required_moves
    assert [game_move in moves for game_move in game_moves]

    # Ensure ordering is correct
    assert len(expected_indexes) == num_required_moves
    for i in range(num_required_moves):
        assert game_moves[i] == moves[expected_indexes[i]]

def test_top_strongest_strategy():
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
        Move(id=10, position_id=1, uci_move="uci10", engine_eval="#-5", engine_overall_rank=10),
     ]
    assert len(moves) == 10

    _test_helper(strategy=strategy_not_distinct, moves=moves, num_required_moves=2, expected_indexes=[0,1])
    _test_helper(strategy=strategy_distinct, moves=moves, num_required_moves=2, expected_indexes=[0,1])

    _test_helper(strategy=strategy_not_distinct, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_distinct, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,4])

    _test_helper(strategy=strategy_not_distinct, moves=moves, num_required_moves=5, expected_indexes=[0,1,2,3,4])
    _test_helper(strategy=strategy_distinct, moves=moves, num_required_moves=5, expected_indexes=[0,1,2,4,7])
