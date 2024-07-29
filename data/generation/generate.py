"""
Chessort - Generate data for the game
=============================================

This script analyzes chess positions from FEN strings using Stockfish and retrieves the top N moves.
It filters out positions that do not meet a minimum number of distinct move evaluations and saves the
results to a CSV file.

Requirements:
- Python 3.x
- python-chess library
- Stockfish engine

Ensure the Stockfish engine path is correctly set in the 'STOCKFISH_PATH' environment variable. 

Configuration Parameters:
- STOCKFISH_PATH: Path to the Stockfish executable.
- LICHESS_PUZZLE_FILE: Path to the input Lichess puzzle CSV file (relative to current directory).
- BASE_OUTPUT_FILE_PATH: Base path to the output CSV file (relative to current directory).
- MIN_MOVES_REQUIRED: Minimum number of moves required to process this result (after first opponent move is made).
- MIN_POPULARITY_REQUIRED: Minimum popularity score required.
- MIN_NUMBER_PLAYS_REQUIRED: Minimum number of plays required.
- MAX_RATING_DEVIATION: Maximum rating deviation allowed.
- LICHESS_PUZZLE_FILE_OFFSET: Line offset to start processing from in the Lichess puzzle file.
- LICHESS_PUZZLE_FILE_LIMIT: Number of lines to process from the Lichess puzzle file.
- MULTI_PV: Number of top moves to evaluate for each FEN.
- EVALUATION_DEPTH: Depth to which Stockfish engine evaluates the positions.
- MAX_WORKERS: Number of worker processes to use.
- STOCKFISH_THREADS_PER_ENGINE: Number of threads per Stockfish engine instance.
- HASH_SIZE: Size of the hash table for the Stockfish engine in MB.

Output CSV format:
- LichessPuzzleId: ID of the puzzle.
- FEN: FEN string of the position.
- Rating: Rating of the puzzle.
- EvaluatedMoves: Comma-separated list of moves in UCI format followed by their evaluation.

Metadata JSON format:
- stockfishVersion: Version of the Stockfish engine used.
- offset: Line offset in the input file from which processing started.
- limit: Number of lines processed.
- evaluationDepth: Depth to which Stockfish evaluated the positions.
- multipv: Number of top moves evaluated.
- minimumMovesRequired: Minimum number of moves required.
- minPopularityRequired: Minimum popularity score required.
- minNumberPlaysRequired: Minimum number of plays required.
- minRatingDeviation: Maximum rating deviation allowed.
- inputLichessFileSha256: SHA-256 hash of the input Lichess puzzle file.
- outputFileSha256: SHA-256 hash of the generated output CSV file.
"""

import os
import csv
import chess
import chess.engine
from concurrent.futures import ProcessPoolExecutor, as_completed
import hashlib
import json

# Configuration
STOCKFISH_PATH = os.getenv('STOCKFISH_PATH', '/usr/local/bin/stockfish')
LICHESS_PUZZLE_FILE = os.path.join(os.getcwd(), 'lichess-data', 'lichess_db_puzzle.csv')
BASE_OUTPUT_FILE_PATH = os.path.join(os.getcwd(), 'out', 'chessort')

MIN_MOVES_REQUIRED = 4
MIN_POPULARITY_REQUIRED = 90
MIN_NUMBER_PLAYS_REQUIRED = 100
MAX_RATING_DEVIATION = 100

LICHESS_PUZZLE_FILE_OFFSET = 1700000
LICHESS_PUZZLE_FILE_LIMIT = 5

MULTI_PV = 50
EVALUATION_DEPTH = 22

MAX_WORKERS = 24
STOCKFISH_THREADS_PER_ENGINE = 1
HASH_SIZE = 1875

def get_stockfish_version():
    with chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH) as engine:
        version_info = engine.protocol.id.get("name", "Unknown Version")
    return version_info.replace('Stockfish ', '')

def sha256sum(filename):
    h = hashlib.sha256()
    with open(filename, 'rb') as file:
        while chunk := file.read(8192):
            h.update(chunk)
    return h.hexdigest()

def switch_eval(engine_eval):
    """ Convert the engine evaluation to other players perspective """
    if isinstance(engine_eval, chess.engine.Mate):
        mate_moves = -engine_eval.moves
        return chess.engine.Mate(mate_moves)
    elif isinstance(engine_eval, chess.engine.Cp):
        eval_value = -engine_eval.score()
        return chess.engine.Cp(eval_value)
    else:
        raise ValueError(f"Unexpected evaluation type: {engine_eval}")

# Analyze the top moves for a given FEN
def analyze_top_moves(fen, top_n, depth):
    with chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH) as engine:
        engine.configure({"Threads": STOCKFISH_THREADS_PER_ENGINE, "Hash": HASH_SIZE})

        board = chess.Board(fen)
        result = engine.analyse(board, chess.engine.Limit(depth=depth), multipv=top_n)
        moves = []
        
        for info in result:
            move = info['pv'][0].uci()
            score = info['score'].relative
            
            moves.append((move, score))
            
    return moves

# Process an FEN
def process_puzzle(puzzle):
    lichess_puzzle_id = puzzle['PuzzleId']
    original_fen = puzzle['FEN']
    rating = puzzle['Rating']
    moves = puzzle['Moves'].split()

    print(f"[{lichess_puzzle_id}] Processing...")

    # FEN is the position before the opponent makes their move.
    # The position to present to the player is after applying the first move to that FEN.
    # The second move is the beginning of the solution.
    # See: https://database.lichess.org/#puzzles
    board = chess.Board(original_fen)
    opponent_first_move = chess.Move.from_uci(moves[0])

    # Analyze the board state before making the first move
    pre_last_move_top_moves = analyze_top_moves(original_fen, top_n=1, depth=EVALUATION_DEPTH)
    if not pre_last_move_top_moves:
        print(f"[{lichess_puzzle_id}] Skipped. No evaluation for the original position.")
        return None
    pre_last_move_evaluation = pre_last_move_top_moves[0][1]

    # Make opponents move (the first move) now
    board.push(opponent_first_move)

    # Generate top moves
    top_moves = analyze_top_moves(board.fen(), top_n=MULTI_PV, depth=EVALUATION_DEPTH)
    
    # Ensure we have the minimum number of total moves
    if len(top_moves) < MIN_MOVES_REQUIRED:
        print(f"[{lichess_puzzle_id}] Skipped. Not enough total moves. Found: {len(top_moves)}. Need: {MIN_MOVES_REQUIRED}.")
        return None

    # Create a comma-separated list of moves with evaluations
    moves_str = ','.join([f"{move} {score}" for move, score in top_moves])
    
    best_top_move_evaluation = top_moves[0][1]
    best_top_move_evaluation_relative_to_opponent = switch_eval(best_top_move_evaluation)

    return {
        'LichessPuzzleId': lichess_puzzle_id,
        'FEN': board.fen(),
        'Rating': rating,
        'PreLastMovePositionEvaluation': pre_last_move_evaluation,
        'LastMove': f"{opponent_first_move.uci()} {best_top_move_evaluation_relative_to_opponent}",
        'CurrentPositionEvaluation': best_top_move_evaluation,
        'EvaluatedMoves': moves_str,
    }

def meets_criteria(row):
    return (
        int(row['Popularity']) >= MIN_POPULARITY_REQUIRED and
        int(row['NbPlays']) >= MIN_NUMBER_PLAYS_REQUIRED and
        int(row['RatingDeviation']) <= MAX_RATING_DEVIATION
    )

# Process input file into a puzzle
def process_input_file(file_path, offset=0, limit=10):
    output_file_path = f"{BASE_OUTPUT_FILE_PATH}-{offset}-{limit}.csv"
    metadata_file_path = f"{BASE_OUTPUT_FILE_PATH}-{offset}-{limit}.metadata.json"
    
    # Short circuit if the output file already exists
    if os.path.exists(output_file_path):
        print(f"Output file {output_file_path} already exists. Exiting.")
        return

    stockfish_version = get_stockfish_version()
    input_lichess_file_sha256 = sha256sum(file_path)

    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        with ProcessPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {
                executor.submit(process_puzzle, row): row for i, row in enumerate(reader) 
                if i >= offset and i < offset + limit and meets_criteria(row)
            }
            with open(output_file_path, 'w', newline='') as csvfile:
                fieldnames = ['LichessPuzzleId', 'FEN', 'Rating', 'PreLastMovePositionEvaluation', 'LastMove', 'CurrentPositionEvaluation', 'EvaluatedMoves']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for future in as_completed(futures):
                    result = future.result()
                    if result:
                        writer.writerow(result)
                        print(f"[{result['LichessPuzzleId']}] Successfully processed.")

    # Generate and store meta data file
    output_file_sha256 = sha256sum(output_file_path)
    metadata = {
        "stockfishVersion": stockfish_version,
        "offset": offset,
        "limit": limit,
        "evaluationDepth": EVALUATION_DEPTH,
        "multipv": MULTI_PV,
        "minimumMovesRequired": MIN_MOVES_REQUIRED,
        "minPopularityRequired": MIN_POPULARITY_REQUIRED,
        "minNumberPlaysRequired": MIN_NUMBER_PLAYS_REQUIRED,
        "minRatingDeviation": MAX_RATING_DEVIATION,
        "inputLichessFileSha256": input_lichess_file_sha256,
        "outputFileSha256": output_file_sha256
    }

    with open(metadata_file_path, 'w') as metafile:
        json.dump(metadata, metafile, indent=4)

def main():
    # Create directory if it doesn't exist
    output_dir = os.path.dirname(BASE_OUTPUT_FILE_PATH)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    process_input_file(LICHESS_PUZZLE_FILE, LICHESS_PUZZLE_FILE_OFFSET, LICHESS_PUZZLE_FILE_LIMIT)


if __name__ == "__main__":
    main()
