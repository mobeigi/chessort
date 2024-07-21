import os
from sqids import Sqids
from dotenv import load_dotenv

load_dotenv()

secret_alphabet = os.getenv('SQIDS_SECRET_ALPHABET', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
sqids = Sqids(alphabet=secret_alphabet)

def generate_game_id(puzzle_id, move_ids):
    """ Generate a game ID using sqids """
    sorted_move_ids = sorted(move_ids)
    return sqids.encode([puzzle_id] + sorted_move_ids)

def decode_game_id(game_id):
    """ Decode a game ID using sqids """
    return sqids.decode(game_id)
