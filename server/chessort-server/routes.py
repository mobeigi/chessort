from flask import Blueprint, jsonify, request
from .db_client import get_random_game, get_game_by_game_id, register_game_played, get_game_solution, get_games_played_id
from .utils import generate_game_id, decode_game_id, to_move_hash
import random

app = Blueprint('app', __name__)

@app.route('/api/game/<gameId>', methods=['GET'])
def get_game(gameId):
    # Decode game id sqid
    decoded_ids = decode_game_id(gameId)
    if len(decoded_ids) != 1:
        return jsonify({'error': 'Invalid game id.'}), 404

    game_id = decoded_ids[0]
    
    # Get game
    position, moves = get_game_by_game_id(game_id)

    if not position or len(moves) != 4:
        return jsonify({'error': 'Game was not found.'}), 404

    # Register game as being played
    fen = position.FEN
    uci_moves = [move.UciMove for move in moves]
    move_hash = to_move_hash(uci_moves)
    _, position_hits, game_hits = register_game_played(fen, move_hash)

    # Shuffle the moves for the response
    random.shuffle(uci_moves)

    return jsonify({
        'gameId': gameId,
        'fen': position.FEN,
        'uciMoves': uci_moves,
        'difficulty': 'BEGINNER',
        'positionHits': position_hits,
        'gameHits': game_hits
    })

@app.route('/api/game/random', methods=['GET'])
def api_get_random_game():
    # Get a random game
    position, moves = get_random_game()
    
    if not position or len(moves) != 4:
        return jsonify({'error': 'No position found or insufficient/excess moves found for position.'}), 404

    # Insert game played id
    fen = position.FEN
    uci_moves = [move.UciMove for move in moves]
    move_hash = to_move_hash(uci_moves)
    game_played_id, position_hits, game_hits = register_game_played(fen, move_hash)

    # Generate the game ID
    game_id = generate_game_id(game_played_id)

    # Shuffle the moves for the response
    random.shuffle(uci_moves)

    return jsonify({
        'fen': position.FEN,
        'uciMoves': uci_moves,
        'difficulty': 'BEGINNER',
        'gameId': game_id,
        'positionHits': position_hits,
        'gameHits': game_hits
    })

@app.route('/api/solution', methods=['POST'])
def get_solution():
    # Get request data
    data = request.get_json()
    provided_game_id = data.get('gameId')

    if not provided_game_id:
        return jsonify({'error': 'Invalid input.'}), 400

    # Decode game id sqid
    decoded_ids = decode_game_id(provided_game_id)
    if len(decoded_ids) != 1:
        return jsonify({'error': 'Invalid game id.'}), 404
    game_id = decoded_ids[0]

    # Get solution
    solution = get_game_solution(game_id)

    if not solution:
        return jsonify({'error': 'Game not found.'}), 404
    
    return jsonify({
        'solution': solution,
        'gameId': provided_game_id,
    })
