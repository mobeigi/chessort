from flask import Blueprint, jsonify
from .db_client import get_random_puzzle

import random

app = Blueprint('app', __name__)

@app.route('/api/game/random', methods=['GET'])
def get_random_game():
    puzzle, moves = get_random_puzzle()
    
    if not puzzle or not moves:
        return jsonify({'error': 'No puzzles or moves found'}), 404
    
    move_list = [move.UciMove for move in moves]
    random.shuffle(move_list)

    return jsonify({
        'fen': puzzle.FEN,
        'uciMoves': move_list,
        'difficulty': 'BEGINNER'
    })
