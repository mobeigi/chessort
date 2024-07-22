from flask import Blueprint, request, jsonify
from .db_client import get_random_puzzle, get_game_solution, get_puzzle_and_move_ids, get_puzzle_and_moves_by_ids
from .utils import generate_game_id, decode_game_id
import random

app = Blueprint('app', __name__)

@app.route('/api/game/<gameId>', methods=['GET'])
def get_game(gameId):
    decoded_ids = decode_game_id(gameId)

    if len(decoded_ids) != 5:
        return jsonify({'error': 'Invalid game id.'}), 404

    puzzle_id = decoded_ids[0]
    move_ids = decoded_ids[1:]

    puzzle, moves = get_puzzle_and_moves_by_ids(puzzle_id, move_ids)

    if not puzzle or len(moves) != 4:
        return jsonify({'error': 'Puzzle or moves not found'}), 404

    uci_moves = [move.UciMove for move in moves]

    # Shuffle the moves for the response
    random.shuffle(uci_moves)

    return jsonify({
        'fen': puzzle.FEN,
        'uciMoves': uci_moves,
        'difficulty': 'BEGINNER',
        'gameId': gameId
    })

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
