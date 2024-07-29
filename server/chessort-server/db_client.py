import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
import urllib.parse
from .db_models import Base, Positions, Move, GamesPlayed, PositionMetadata, GamesPlayedMetadata
from .utils import from_move_hash

load_dotenv()

# URL encode the username and password
username = urllib.parse.quote_plus(os.getenv('DB_USER'))
password = urllib.parse.quote_plus(os.getenv('DB_PASSWORD'))
host = os.getenv('DB_HOST')
database = os.getenv('DB_DATABASE')

DATABASE_URL = f"mysql+pymysql://{username}:{password}@{host}/{database}"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def get_random_game():
    """ Get a random game from the database """
    session = Session()
    
    position = session.query(Positions).order_by(func.rand()).first()
    
    if position:
        moves = session.query(Move).filter(Move.PositionID == position.ID).order_by(func.rand()).limit(4).all()
    else:
        moves = []

    session.close()

    return position, moves

def register_game_played(fen, move_hash):
    """ Insert a new game played entry and update hits """
    session = Session()
    
    # Check if the position already exists
    position = session.query(Positions).filter_by(FEN=fen).first()
    if not position:
        session.close()
        raise ValueError("The provided FEN does not exist in the Positions table.")
    
    # Check if the game played already exists
    game_played = session.query(GamesPlayed).filter_by(PositionID=position.ID, MoveHash=move_hash).first()
    if not game_played:
        # Insert the new game played entry
        game_played = GamesPlayed(PositionID=position.ID, MoveHash=move_hash)
        session.add(game_played)
        session.commit()  # Commit to get the ID of the new game played
    
    games_played_id = game_played.ID

    # Update hits for PositionMetadata and GamesPlayedMetadata
    position_hits, game_hits = update_hits(session, position.ID, games_played_id, move_hash)
    
    session.commit()
    session.close()

    return games_played_id, position_hits, game_hits

def update_hits(session, position_id, game_played_id, move_hash):
    """ Update hits for PositionMetadata and GamesPlayedMetadata """
    # Update PositionMetadata hits
    position_metadata = session.query(PositionMetadata).filter_by(PositionID=position_id).first()
    if not position_metadata:
        # Insert new PositionMetadata entry
        position_metadata = PositionMetadata(PositionID=position_id, Hits=1)
        session.add(position_metadata)
    else:
        # Increment the hits
        position_metadata.Hits += 1
    
    # Update GamesPlayedMetadata hits
    gamesplayed_metadata = session.query(GamesPlayedMetadata).filter_by(GamesPlayedID=game_played_id).first()
    if not gamesplayed_metadata:
        # Insert new GamesPlayedMetadata entry
        gamesplayed_metadata = GamesPlayedMetadata(GamesPlayedID=game_played_id, Hits=1)
        session.add(gamesplayed_metadata)
    else:
        # Increment the hits
        gamesplayed_metadata.Hits += 1

    return position_metadata.Hits, gamesplayed_metadata.Hits

def get_game_by_game_id(game_id):
    """ Retrieve a game by a game id """
    session = Session()

    result = (
        session.query(GamesPlayed, Positions)
        .join(Positions, GamesPlayed.PositionID == Positions.ID)
        .filter(GamesPlayed.ID == game_id)
        .first()
    )

    if not result:
        session.close()
        return None, []

    game, position = result

    # Ensure moves actually exist
    uci_moves = from_move_hash(game.MoveHash)
    moves = session.query(Move).filter(Move.PositionID == position.ID, Move.UciMove.in_(uci_moves)).all()
    
    session.close()

    return position, moves


def get_games_played_id(fen, move_hash):
    """ Retrieve the ID of a game played based on the FEN and move hash """
    session = Session()

    # Retrieve the position based on the FEN
    position = session.query(Positions).filter_by(FEN=fen).first()
    if not position:
        session.close()
        return None

    # Retrieve the game played ID based on the position ID and move hash
    game_played = session.query(GamesPlayed).filter_by(PositionID=position.ID, MoveHash=move_hash).first()
    session.close()

    if not game_played:
        return None

    return game_played.ID

def get_game_solution(game_id):
    """ Get the solution for a game based on the game_id """
    session = Session()

    # Retrieve the game played based on the game_id
    game_played = session.query(GamesPlayed).filter_by(ID=game_id).first()
    if not game_played:
        session.close()
        return None

    # Retrieve the position based on the PositionID from the game played
    position = session.query(Positions).filter_by(ID=game_played.PositionID).first()
    if not position:
        session.close()
        return None

    # Extract UCI moves from the move hash
    uci_moves = from_move_hash(game_played.MoveHash)

    # Retrieve the moves based on the PositionID and UCI moves
    moves = session.query(Move).filter(
        Move.PositionID == position.ID,
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
