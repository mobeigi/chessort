from pydantic import BaseModel

""" These models act as our DTOs"""

class Move(BaseModel):
    id: int
    position_id: int
    uci_move: str
    engine_eval: str
    engine_overall_rank: int

class Position(BaseModel):
    id: int
    lichess_puzzle_id: str
    fen: str
    rating: int
    pre_last_move_position_eval: str
    last_uci_move: str
    current_position_eval: str

class PositionMetadata(BaseModel):
    id: int
    position_id: int
    hits: int

class GamesPlayedMetadata(BaseModel):
    id: int
    games_played_id: int
    hits: int
    difficulty: int

class GamesPlayed(BaseModel):
    id: int
    position_id: int
    move_hash: str
