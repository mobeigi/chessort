from flask import Blueprint, request, jsonify
from .db_client import get_random_puzzle, get_game_solution, get_puzzle_and_move_ids
from .utils import generate_game_id
import random

app = Blueprint('app', __name__)

@app.route('/api/game/random', methods=['GET'])
def get_random_game():
    puzzle, moves = get_random_puzzle()
    
    if not puzzle or len(moves) != 4:
        return jsonify({'error': 'No puzzles or insufficient/excess moves found'}), 404

    # Generate the game ID
    uci_moves = [move.UciMove for move in moves]
    puzzle_id, move_ids = get_puzzle_and_move_ids(puzzle.FEN, uci_moves)
    
    if not puzzle_id or len(move_ids) != 4:
        return jsonify({'error': 'Error generating game ID'}), 500

    game_id = generate_game_id(puzzle_id, move_ids)
    
    # Shuffle the moves for the response
    random.shuffle(uci_moves)

    return jsonify({
        'fen': puzzle.FEN,
        'uciMoves': uci_moves,
        'difficulty': 'BEGINNER',
        'gameId': game_id
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

    # Generate the game ID
    puzzle_id, move_ids = get_puzzle_and_move_ids(fen, uci_moves)
    
    if not puzzle_id or len(move_ids) != 4:
        return jsonify({'error': 'Error generating game ID'}), 500

    game_id = generate_game_id(puzzle_id, move_ids)

    return jsonify({
        'solution': solution,
        'gameId': game_id
    })
