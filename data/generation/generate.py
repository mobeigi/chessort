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
- NUM_OF_MOVES_TO_EVALUATE: Number of top moves to evaluate for each FEN.
- MIN_DISTINCT_MOVE_BUCKETS: Minimum number of distinct move evaluations required to include the FEN.
- STOCKFISH_PATH: Path to the Stockfish executable.
- LICHESS_PUZZLE_FILE: Path to the input Lichess puzzle CSV file (relative to current directory).
- BASE_OUTPUT_FILE_PATH: Base path to the output CSV file (relative to current directory).
- LICHESS_PUZZLE_FILE_OFFSET: Line offset to start processing from in the Lichess puzzle file.
- LICHESS_PUZZLE_FILE_NUM_TO_PROCESS: Number of lines to process from the Lichess puzzle file.
- EVALUATION_DEPTH: Depth to which Stockfish engine evaluates the positions.
- MAX_WORKERS: Number of worker processes to use.
- STOCKFISH_THREADS_PER_ENGINE: Number of threads per Stockfish engine instance.
- HASH_SIZE: Size of the hash table for the Stockfish engine in MB.

Output CSV format:
- LichessPuzzleId: ID of the puzzle.
- FEN: FEN string of the position.
- Rating: Rating of the puzzle.
- Moves: Comma-separated list of moves in UCI format followed by their evaluation.
"""

import os
import csv
import chess
import chess.engine
from concurrent.futures import ProcessPoolExecutor, as_completed

# Configuration
STOCKFISH_PATH = os.getenv('STOCKFISH_PATH', '/usr/local/bin/stockfish')
LICHESS_PUZZLE_FILE = os.path.join(os.getcwd(), 'lichess-data', 'lichess_db_puzzle.csv')
BASE_OUTPUT_FILE_PATH = os.path.join(os.getcwd(), 'out', 'chessort')

NUM_OF_MOVES_TO_EVALUATE = 50
MIN_DISTINCT_MOVE_BUCKETS = 8
LICHESS_PUZZLE_FILE_OFFSET = 100000
LICHESS_PUZZLE_FILE_NUM_TO_PROCESS = 5
EVALUATION_DEPTH = 22

MAX_WORKERS = 24
STOCKFISH_THREADS_PER_ENGINE = 1
HASH_SIZE = 1875

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

def count_min_distinct_move_buckets(moves):
    # Extract the distinct evaluations
    distinct_evaluations = set()
    for move, score in moves:
        if score.is_mate():
            eval_str = f"mate{score.mate()}"
        else:
            eval_str = f"cp{score.score()}"
        distinct_evaluations.add(eval_str)
    return len(distinct_evaluations)

# Process an FEN
def process_puzzle(puzzle):
    lichess_puzzle_id = puzzle['PuzzleId']
    fen = puzzle['FEN']
    rating = puzzle['Rating']

    print(f"[{lichess_puzzle_id}] Processing...")

    # Generate top moves
    top_moves = analyze_top_moves(fen, top_n=NUM_OF_MOVES_TO_EVALUATE, depth=EVALUATION_DEPTH)
    puzzle_min_buckets = count_min_distinct_move_buckets(top_moves)
    
    # Ensure we have the minimum number of top moves desired to make interesting puzzles
    if puzzle_min_buckets < MIN_DISTINCT_MOVE_BUCKETS:
        print(f"[{lichess_puzzle_id}] Skipped. Not enough distinct move buckets. Found: {puzzle_min_buckets}. Need: {MIN_DISTINCT_MOVE_BUCKETS}.")
        return None

    # Create a comma-separated list of moves with evaluations
    moves_str = ', '.join([f"{move} {score}" for move, score in top_moves])

    return {
        'LichessPuzzleId': lichess_puzzle_id,
        'FEN': fen,
        'Rating': rating,
        'Moves': moves_str
    }

# Process input file into a puzzle
def process_input_file(file_path, offset=0, limit=10):
    output_file_path = f"{BASE_OUTPUT_FILE_PATH}-{offset}-{limit}.csv"
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

def main():
    # Create directory if it doesn't exist
    output_dir = os.path.dirname(BASE_OUTPUT_FILE_PATH)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    process_input_file(LICHESS_PUZZLE_FILE, LICHESS_PUZZLE_FILE_OFFSET, LICHESS_PUZZLE_FILE_NUM_TO_PROCESS)


if __name__ == "__main__":
    main()
