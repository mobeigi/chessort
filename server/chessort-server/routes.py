from flask import Blueprint, jsonify

app = Blueprint('app', __name__)

@app.route('/api/game/random', methods=['GET'])
def get_random_game():
    # Example response, replace with actual logic
    return jsonify({
        'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        'uciMoves': ['e2e4', 'e7e5', 'g1f3', 'b8c6'],
        'difficulty': 'BEGINNER'
    })
