from flask import Blueprint, request, jsonify
from .db_client import get_random_puzzle, get_game_solution
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

@app.route('/api/solution', methods=['POST'])
def get_solution():
    data = request.get_json()
    fen = data.get('fen')
    uci_moves = data.get('uciMoves')

    if not fen or not uci_moves or len(uci_moves) != 4:
        return jsonify({'error': 'Invalid input'}), 400

    solution = get_game_solution(fen, uci_moves)

    if not solution:
        return jsonify({'error': 'Solution not found'}), 404

    return jsonify({'solution': solution})
