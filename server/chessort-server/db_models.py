from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Puzzle(Base):
    __tablename__ = 'Puzzles'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    LichessPuzzleId = Column(String(10), nullable=False)
    FEN = Column(String, nullable=False)
    Rating = Column(Integer)

class Move(Base):
    __tablename__ = 'Moves'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    PuzzleID = Column(Integer, ForeignKey('Puzzles.ID'), nullable=False)
    UciMove = Column(String(10), nullable=False)
    EngineEval = Column(String(10), nullable=False)
    EngineOverallRank = Column(Integer)

    puzzle = relationship("Puzzle", back_populates="moves")

Puzzle.moves = relationship("Move", order_by=Move.ID, back_populates="puzzle")
