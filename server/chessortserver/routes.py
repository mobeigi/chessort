from flask import Blueprint, jsonify, request

from chessortserver.models.models import Move, Position
from .db.db_client import get_game_by_game_id, register_game_played, get_game_solution, get_random_position_with_all_moves
from .utils.sqids import generate_game_id, decode_game_id
from .utils.helpers import to_move_hash, map_difficulty
from .utils.difficulty import get_difficulty
from .services.generation.game_curator import GameCurator
from .models.converters import from_dao
import random

app = Blueprint('app', __name__)
gc = GameCurator()

@app.route('/game/<gameId>', methods=['GET'])
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

    # Compute difficulty
    engine_evals = [move.EngineEval for move in moves]
    difficulty = get_difficulty(engine_evals)
    difficulty_str = map_difficulty(difficulty).value

    # Shuffle the moves for the response
    random.shuffle(uci_moves)

    return jsonify({
        'gameId': gameId,
        'fen': position.FEN,
        'uciMoves': uci_moves,
        'difficulty': difficulty_str,
        'positionHits': position_hits,
        'gameHits': game_hits
    })

@app.route('/game/random', methods=['GET'])
def get_random_game():
    # Get a random position with all moves
    position_dao, all_moves_daos = get_random_position_with_all_moves()
    
    if not position_dao or len(all_moves_daos) < 4:
        return jsonify({'error': 'No position found or insufficient moves found for position.'}), 404

    # Convert to DTO's
    position = from_dao(position_dao)
    all_moves = [ from_dao(move_dao) for move_dao in all_moves_daos ]

    # Create a game from game generator
    moves = gc.select_moves_for_game(position, all_moves, 4)

    if len(moves) < 4:
        return jsonify({'error': 'Failed to generate moves for game.'}), 500

    # Insert game played id
    uci_moves = [move.uci_move for move in moves]
    move_hash = to_move_hash(uci_moves)
    game_played_id, position_hits, game_hits = register_game_played(position.fen, move_hash)

    # Generate the game ID
    game_id = generate_game_id(game_played_id)

    # Compute difficulty
    engine_evals = [move.engine_eval for move in moves]
    difficulty = get_difficulty(engine_evals)
    difficulty_str = map_difficulty(difficulty).value

    # Shuffle the moves for the response
    random.shuffle(uci_moves)

    return jsonify({
        'fen': position.fen,
        'uciMoves': uci_moves,
        'difficulty': difficulty_str,
        'gameId': game_id,
        'positionHits': position_hits,
        'gameHits': game_hits
    })

@app.route('/solution', methods=['POST'])
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
