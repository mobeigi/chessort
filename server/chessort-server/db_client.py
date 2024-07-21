import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
import urllib.parse
from .db_models import Base, Puzzle, Move

load_dotenv()

# URL encode the username and password
username = urllib.parse.quote_plus(os.getenv('DB_USER'))
password = urllib.parse.quote_plus(os.getenv('DB_PASSWORD'))
host = os.getenv('DB_HOST')
database = os.getenv('DB_DATABASE')

DATABASE_URL = f"mysql+pymysql://{username}:{password}@{host}/{database}"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def get_puzzle_and_move_ids(fen, uci_moves):
    """
    Retrieve the puzzle ID and move IDs based on the FEN and UCI moves.
    """
    session = Session()
    
    puzzle = session.query(Puzzle).filter_by(FEN=fen).first()
    if not puzzle:
        session.close()
        return None, None

    puzzle_id = puzzle.ID

    move_ids = []
    for uci_move in uci_moves:
        move = session.query(Move).filter_by(PuzzleID=puzzle_id, UciMove=uci_move).first()
        if move:
            move_ids.append(move.ID)
        else:
            session.close()
            return None, None
    
    session.close()
    return puzzle_id, move_ids


def get_random_puzzle():
    """ Get a random puzzle from the database """
    session = Session()
    
    puzzle = session.query(Puzzle).order_by(func.rand()).first()
    
    if puzzle:
        moves = session.query(Move).filter(Move.PuzzleID == puzzle.ID).order_by(func.rand()).limit(4).all()
    else:
        moves = []

    session.close()

    return puzzle, moves

def get_game_solution(fen, uci_moves):
    """ Get the solution for a game """
    session = Session()
    
    puzzle = session.query(Puzzle).filter_by(FEN=fen).first()
    
    if not puzzle:
        session.close()
        return None

    moves = session.query(Move).filter(
        Move.PuzzleID == puzzle.ID,
        Move.UciMove.in_(uci_moves)
    ).all()

    if len(moves) != len(uci_moves):
        session.close()
        return None

    solution = [
        {
            'uciMove': move.UciMove,
            'evalResult': {
                'engineEval': move.EngineEval,
                'engineOverallRank': move.EngineOverallRank
            }
        }
        for move in moves
    ]
    
    solution = sorted(solution, key=lambda x: x['evalResult']['engineOverallRank'])

    session.close()

    return solution