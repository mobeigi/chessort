import os
import random
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
