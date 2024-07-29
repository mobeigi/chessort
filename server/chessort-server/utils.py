import os
from sqids import Sqids
from dotenv import load_dotenv

load_dotenv()

secret_alphabet = os.getenv('SQIDS_SECRET_ALPHABET', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
sqids = Sqids(alphabet=secret_alphabet)

def generate_game_id(game_played_id):
    """ Generate a game ID using sqids """
    return sqids.encode([game_played_id])

def decode_game_id(game_id):
    """ Decode a game ID using sqids """
    return sqids.decode(game_id)

def to_move_hash(uci_moves):
    """
    Convert a list of UCI moves into a sorted comma-separated move hash.
    
    Args:
        moves (list): A list of UCI moves.
    
    Returns:
        str: A sorted comma-separated move hash.
    """
    sorted_moves = sorted(uci_moves)
    return ','.join(sorted_moves)

def from_move_hash(move_hash):
    """
    Convert a move hash into a sorted list of moves.
    
    Args:
        move_hash (str): A comma-separated string of UCI moves.
    
    Returns:
        list: A sorted list of UCI moves.
    """
    return move_hash.split(',')
