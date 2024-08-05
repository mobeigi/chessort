import pytest

from chessortserver.services.generation.exception.game_generation_error import GameGenerationError
from chessortserver.services.generation.strategies.top_spread_strategy import TopSpreadStrategy
from chessortserver.models.models import Move, Position
from chessortserver.utils.engine.strength import normalised_strength

from fixtures.fixtures import random_move, random_position

def eval_to_normalised_spread(eval: str) -> float:
    return normalised_strength([eval])[0] - 0.5

position = random_position()
strategy_0_cp = TopSpreadStrategy(normalised_spread=eval_to_normalised_spread('0'))
strategy_50_cp = TopSpreadStrategy(normalised_spread=eval_to_normalised_spread('50'))
strategy_150_cp = TopSpreadStrategy(normalised_spread=eval_to_normalised_spread('150'))
strategy_300_cp = TopSpreadStrategy(normalised_spread=eval_to_normalised_spread('300'))
strategy_500_cp = TopSpreadStrategy(normalised_spread=eval_to_normalised_spread('500'))

strategies = [ strategy_0_cp, strategy_50_cp, strategy_150_cp, strategy_300_cp, strategy_500_cp]

def test_can_handle_insufficient_moves_buckets():
    moves = [ 
        Move(id=1, position_id=position.id, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=position.id, uci_move="uci2", engine_eval="#1", engine_overall_rank=2),
        Move(id=3, position_id=position.id, uci_move="uci3", engine_eval="#2", engine_overall_rank=3),
        Move(id=4, position_id=position.id, uci_move="uci4", engine_eval="#2", engine_overall_rank=4),
        Move(id=5, position_id=position.id, uci_move="uci5", engine_eval="#3", engine_overall_rank=5),
        Move(id=6, position_id=position.id, uci_move="uci5", engine_eval="#3", engine_overall_rank=6),
     ]
    assert len(moves) == 6
    
    for strategy in strategies:
        # Can handle, enough buckets
        assert strategy.can_handle(position=position, moves=moves, num_required_moves=1)
        assert strategy.can_handle(position=position, moves=moves, num_required_moves=2)
        assert strategy.can_handle(position=position, moves=moves, num_required_moves=3)

        # Cannot handle, not enough buckets
        assert not strategy.can_handle(position=position, moves=moves, num_required_moves=4)


def _test_helper(strategy: TopSpreadStrategy, moves: list[Move], num_required_moves: int, expected_indexes: list[int]) -> list[Move]:
    game_moves = strategy.select_moves(position, moves, num_required_moves)
    assert len(game_moves) == num_required_moves
    assert [game_move in moves for game_move in game_moves]

    # Ensure ordering is correct
    assert len(expected_indexes) == num_required_moves
    for i in range(num_required_moves):
        assert game_moves[i] == moves[expected_indexes[i]]

def test_top_spread_strategy_max_spread():
    moves = [ 
        Move(id=1, position_id=position.id, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=position.id, uci_move="uci2", engine_eval="+2500", engine_overall_rank=2),
        Move(id=3, position_id=position.id, uci_move="uci3", engine_eval="0", engine_overall_rank=3),
        Move(id=4, position_id=position.id, uci_move="uci4", engine_eval="-2500", engine_overall_rank=4),
        Move(id=5, position_id=position.id, uci_move="uci5", engine_eval="#-1", engine_overall_rank=5)
     ]
    assert len(moves) == 5

    for strategy in strategies:
        assert strategy.can_handle(position, moves, num_required_moves=4)
    
    _test_helper(strategy=strategy_0_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_50_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_150_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_300_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_500_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])

def test_top_spread_strategy_high_spread():
    moves = [ 
        Move(id=1, position_id=position.id, uci_move="uci1", engine_eval="#1", engine_overall_rank=1),
        Move(id=2, position_id=position.id, uci_move="uci2", engine_eval="+200", engine_overall_rank=2),
        Move(id=3, position_id=position.id, uci_move="uci3", engine_eval="0", engine_overall_rank=3),
        Move(id=4, position_id=position.id, uci_move="uci4", engine_eval="-200", engine_overall_rank=4),
        Move(id=5, position_id=position.id, uci_move="uci5", engine_eval="#-1", engine_overall_rank=5)
     ]
    assert len(moves) == 5

    for strategy in strategies:
        assert strategy.can_handle(position, moves, num_required_moves=4)
    
    _test_helper(strategy=strategy_0_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_50_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_150_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_300_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,3,4])

    with pytest.raises(GameGenerationError):
        strategy_500_cp.select_moves(position, moves, num_required_moves=4)
    
def test_top_spread_strategy_low_spread():
    moves = [ 
        Move(id=1, position_id=position.id, uci_move="uci1", engine_eval="+750", engine_overall_rank=1),
        Move(id=2, position_id=position.id, uci_move="uci2", engine_eval="+300", engine_overall_rank=2),
        Move(id=3, position_id=position.id, uci_move="uci3", engine_eval="0", engine_overall_rank=3),
        Move(id=4, position_id=position.id, uci_move="uci4", engine_eval="-300", engine_overall_rank=4),
        Move(id=5, position_id=position.id, uci_move="uci5", engine_eval="-750", engine_overall_rank=5)
     ]
    assert len(moves) == 5

    for strategy in strategies:
        assert strategy.can_handle(position, moves, num_required_moves=4)
    
    _test_helper(strategy=strategy_0_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_50_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_150_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_300_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])

    with pytest.raises(GameGenerationError):
        strategy_500_cp.select_moves(position, moves, num_required_moves=4)
    
def test_top_spread_strategy_very_low_spread():
    moves = [ 
        Move(id=1, position_id=position.id, uci_move="uci1", engine_eval="+40", engine_overall_rank=1),
        Move(id=2, position_id=position.id, uci_move="uci2", engine_eval="-20", engine_overall_rank=2),
        Move(id=3, position_id=position.id, uci_move="uci3", engine_eval="-90", engine_overall_rank=3),
        Move(id=4, position_id=position.id, uci_move="uci4", engine_eval="-91", engine_overall_rank=4),
        Move(id=5, position_id=position.id, uci_move="uci5", engine_eval="-150", engine_overall_rank=5)
     ]
    assert len(moves) == 5

    for strategy in strategies:
        assert strategy.can_handle(position, moves, num_required_moves=4)
    
    _test_helper(strategy=strategy_0_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,3])
    _test_helper(strategy=strategy_50_cp, moves=moves, num_required_moves=4, expected_indexes=[0,1,2,4])

    with pytest.raises(GameGenerationError):
        strategy_150_cp.select_moves(position, moves, num_required_moves=4)
    
    with pytest.raises(GameGenerationError):
        strategy_300_cp.select_moves(position, moves, num_required_moves=4)

    with pytest.raises(GameGenerationError):
        strategy_500_cp.select_moves(position, moves, num_required_moves=4)
    