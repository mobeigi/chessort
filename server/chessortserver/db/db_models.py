from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class PositionsDAO(Base):
    __tablename__ = 'Positions'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    LichessPuzzleId = Column(String(10), nullable=False)
    FEN = Column(Text, nullable=False, unique=True)
    Rating = Column(Integer)
    PreLastMovePositionEval = Column(String(10))
    LastUciMove = Column(String(10))
    CurrentPositionEval = Column(String(10))

class MoveDAO(Base):
    __tablename__ = 'Moves'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    PositionID = Column(Integer, ForeignKey('Positions.ID'), nullable=False)
    UciMove = Column(String(10), nullable=False)
    EngineEval = Column(String(10), nullable=False)
    EngineOverallRank = Column(Integer)

    position = relationship("PositionsDAO", back_populates="moves")

PositionsDAO.moves = relationship("MoveDAO", order_by=MoveDAO.ID, back_populates="position")

class GamesPlayedDAO(Base):
    __tablename__ = 'GamesPlayed'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    PositionID = Column(Integer, ForeignKey('Positions.ID'), nullable=False)
    MoveHash = Column(String(23), nullable=False)  # Comma-separated list of 4 sorted UCI moves

class PositionMetadataDAO(Base):
    __tablename__ = 'PositionMetadata'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    PositionID = Column(Integer, ForeignKey('Positions.ID'), nullable=False)
    Hits = Column(Integer, default=0)

class GamesPlayedMetadataDAO(Base):
    __tablename__ = 'GamesPlayedMetadata'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    GamesPlayedID = Column(Integer, ForeignKey('GamesPlayed.ID'), nullable=False)
    Hits = Column(Integer, default=0)
    Difficulty = Column(Integer)
