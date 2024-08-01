import os
from sqids import Sqids
from dotenv import load_dotenv

load_dotenv()

# Once set these should not change to avoid breaking existing hashes shared in the wild
secret_alphabet = os.getenv('SQIDS_SECRET_ALPHABET', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
min_length = int(os.getenv('SQIDS_MIN_LENGTH', '2'))

sqids = Sqids(alphabet=secret_alphabet, min_length=min_length)

def generate_game_id(game_played_id):
    """ Generate a game ID using sqids """
    return sqids.encode([game_played_id])

def decode_game_id(game_id):
    """ Decode a game ID using sqids """
    return sqids.decode(game_id)
