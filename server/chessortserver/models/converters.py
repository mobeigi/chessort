from functools import singledispatch
from ..db.db_models import PositionsDAO, MoveDAO, GamesPlayedDAO, PositionMetadataDAO, GamesPlayedMetadataDAO
from ..models.models import Position, Move, GamesPlayed, PositionMetadata, GamesPlayedMetadata

# Define the base conversion functions
@singledispatch
def from_dao(dao):
    raise NotImplementedError("Cannot convert this type.")

@singledispatch
def to_dao(dto):
    raise NotImplementedError("Cannot convert this type.")

# From conversions
@from_dao.register
def _(dao: PositionsDAO) -> Position:
    return Position(
        id=dao.ID,
        lichess_puzzle_id=dao.LichessPuzzleId,
        fen=dao.FEN,
        rating=dao.Rating,
        pre_last_move_position_eval=dao.PreLastMovePositionEval,
        last_uci_move=dao.LastUciMove,
        current_position_eval=dao.CurrentPositionEval
    )

@from_dao.register
def _(dao: MoveDAO) -> Move:
    return Move(
        id=dao.ID,
        position_id=dao.PositionID,
        uci_move=dao.UciMove,
        engine_eval=dao.EngineEval,
        engine_overall_rank=dao.EngineOverallRank
    )

@from_dao.register
def _(dao: GamesPlayedDAO) -> GamesPlayed:
    return GamesPlayed(
        id=dao.ID,
        position_id=dao.PositionID,
        move_hash=dao.MoveHash
    )

@from_dao.register
def _(dao: PositionMetadataDAO) -> PositionMetadata:
    return PositionMetadata(
        id=dao.ID,
        position_id=dao.PositionID,
        hits=dao.Hits
    )

@from_dao.register
def _(dao: GamesPlayedMetadataDAO) -> GamesPlayedMetadata:
    return GamesPlayedMetadata(
        id=dao.ID,
        games_played_id=dao.GamesPlayedID,
        hits=dao.Hits,
        difficulty=dao.Difficulty
    )

# To conversions
@to_dao.register
def _(dto: Position) -> PositionsDAO:
    return PositionsDAO(
        ID=dto.id,
        LichessPuzzleId=dto.lichess_puzzle_id,
        FEN=dto.fen,
        Rating=dto.rating,
        PreLastMovePositionEval=dto.pre_last_move_position_eval,
        LastUciMove=dto.last_uci_move,
        CurrentPositionEval=dto.current_position_eval
    )

@to_dao.register
def _(dto: Move) -> MoveDAO:
    return MoveDAO(
        ID=dto.id,
        PositionID=dto.position_id,
        UciMove=dto.uci_move,
        EngineEval=dto.engine_eval,
        EngineOverallRank=dto.engine_overall_rank
    )

@to_dao.register
def _(dto: GamesPlayed) -> GamesPlayedDAO:
    return GamesPlayedDAO(
        ID=dto.id,
        PositionID=dto.position_id,
        MoveHash=dto.move_hash
    )

@to_dao.register
def _(dto: PositionMetadata) -> PositionMetadataDAO:
    return PositionMetadataDAO(
        ID=dto.id,
        PositionID=dto.position_id,
        Hits=dto.hits
    )

@to_dao.register
def _(dto: GamesPlayedMetadata) -> GamesPlayedMetadataDAO:
    return GamesPlayedMetadataDAO(
        ID=dto.id,
        GamesPlayedID=dto.games_played_id,
        Hits=dto.hits,
        Difficulty=dto.difficulty
    )
