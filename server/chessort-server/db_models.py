from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Positions(Base):
    __tablename__ = 'Positions'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    LichessPuzzleId = Column(String(10), nullable=False)
    FEN = Column(Text, nullable=False, unique=True)
    Rating = Column(Integer)
    PreLastMovePositionEval = Column(String(10))
    LastUciMove = Column(String(10))
    CurrentPositionEval = Column(String(10))

class Move(Base):
    __tablename__ = 'Moves'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    PositionID = Column(Integer, ForeignKey('Positions.ID'), nullable=False)
    UciMove = Column(String(10), nullable=False)
    EngineEval = Column(String(10), nullable=False)
    EngineOverallRank = Column(Integer)

    position = relationship("Positions", back_populates="moves")

Positions.moves = relationship("Move", order_by=Move.ID, back_populates="position")

class GamesPlayed(Base):
    __tablename__ = 'GamesPlayed'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    PositionID = Column(Integer, ForeignKey('Positions.ID'), nullable=False)
    MoveHash = Column(String(23), nullable=False)  # Comma-separated list of 4 sorted UCI moves

class PositionMetadata(Base):
    __tablename__ = 'PositionMetadata'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    PositionID = Column(Integer, ForeignKey('Positions.ID'), nullable=False)
    Hits = Column(Integer, default=0)

class GamesPlayedMetadata(Base):
    __tablename__ = 'GamesPlayedMetadata'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    GamesPlayedID = Column(Integer, ForeignKey('GamesPlayed.ID'), nullable=False)
    Hits = Column(Integer, default=0)
