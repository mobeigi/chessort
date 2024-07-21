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
- MIN_MOVES_REQUIRED: Minimum number of moves required to process this result.
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
- Moves: Comma-separated list of moves in UCI format followed by their evaluation.

Metadata JSON format:
- stockfishVersion: Version of the Stockfish engine used.
- offset: Line offset in the input file from which processing started.
- limit: Number of lines processed.
- evaluationDepth: Depth to which Stockfish evaluated the positions.
- multipv: Number of top moves evaluated.
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
LICHESS_PUZZLE_FILE_OFFSET = 100000
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
    fen = puzzle['FEN']
    rating = puzzle['Rating']

    print(f"[{lichess_puzzle_id}] Processing...")

    # Generate top moves
    top_moves = analyze_top_moves(fen, top_n=MULTI_PV, depth=EVALUATION_DEPTH)
    
    # Ensure we have the minimum number of total moves
    if len(top_moves) < MIN_MOVES_REQUIRED:
        print(f"[{lichess_puzzle_id}] Skipped. Not enough total moves. Found: {len(top_moves)}. Need: {MIN_MOVES_REQUIRED}.")
        return None

    # Create a comma-separated list of moves with evaluations
    moves_str = ','.join([f"{move} {score}" for move, score in top_moves])

    return {
        'LichessPuzzleId': lichess_puzzle_id,
        'FEN': fen,
        'Rating': rating,
        'Moves': moves_str
    }

# Process input file into a puzzle
def process_input_file(file_path, offset=0, limit=10):
    output_file_path = f"{BASE_OUTPUT_FILE_PATH}-{offset}-{limit}.csv"
    metadata_file_path = f"{BASE_OUTPUT_FILE_PATH}-{offset}-{limit}.metadata.json"
    
    stockfish_version = get_stockfish_version()
    input_lichess_file_sha256 = sha256sum(file_path)

    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        with ProcessPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {executor.submit(process_puzzle, row): row for i, row in enumerate(reader) if i >= offset and i < offset + limit}
            with open(output_file_path, 'w', newline='') as csvfile:
                fieldnames = ['LichessPuzzleId', 'FEN', 'Rating', 'Moves']
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
