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

Ensure the Stockfish engine path is correctly set in the 'STOCKFISH_PATH' variable or the 'STOCKFISH_EXECUTABLE' 
environment variable. 

Constants:
- NUM_OF_MOVES_TO_EVALUATE: Number of top moves to evaluate for each FEN.
- MIN_DISTINCT_MOVE_BUCKETS: Minimum number of distinct move evaluations required to include the FEN.
- LICHESS_PUZZLE_FILE: Path to the input Lichess puzzle CSV file (relative to current directory).
- CSV_OUTPUT_FILE_PATH: Path to the output CSV file (relative to current directory).
- LICHESS_PUZZLE_FILE_OFFSET: Line offset to start processing from in the Lichess puzzle file.
- LICHESS_PUZZLE_FILE_NUM_TO_PROCESS: Number of lines to process from the Lichess puzzle file.
- EVALUATION_DEPTH: Depth to which Stockfish engine evaluates the positions.

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

# Configuration
NUM_OF_MOVES_TO_EVALUATE = 50
MIN_DISTINCT_MOVE_BUCKETS = 8
STOCKFISH_PATH = os.getenv('STOCKFISH_PATH', '/usr/local/bin/stockfish')
LICHESS_PUZZLE_FILE = os.path.join(os.getcwd(), 'lichess-data', 'lichess_db_puzzle.csv')
CSV_OUTPUT_FILE_PATH = os.path.join(os.getcwd(), 'out', 'chessort.csv')
LICHESS_PUZZLE_FILE_OFFSET = 100000
LICHESS_PUZZLE_FILE_NUM_TO_PROCESS = 10
EVALUATION_DEPTH = 22

# Analyze the top moves for a given FEN
def analyze_top_moves(fen, top_n, depth):
    with chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH) as engine:
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

# Process input file into a puzzle
def process_input_file(file_path, writer, offset=0, num_lines=10):
    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        num_processed = 0
        for i, row in enumerate(reader):
            if i < offset:
                continue
            if num_processed >= num_lines:
                break
            
            # Process this puzzle
            process_puzzle(row, writer)
            num_processed += 1

# Process an FEN
def process_puzzle(puzzle, writer):
    puzzle_id = puzzle['PuzzleId']
    fen = puzzle['FEN']
    rating = puzzle['Rating']

    print(f"Processing Puzzle ID: {puzzle_id}, FEN: {fen}")

    # Generate top moves
    top_moves = analyze_top_moves(fen, top_n=NUM_OF_MOVES_TO_EVALUATE, depth=EVALUATION_DEPTH)
    puzzle_min_buckets = count_min_distinct_move_buckets(top_moves)
    
    # Ensure we have the minimum number of top moves desired to make interesting puzzles
    if puzzle_min_buckets < MIN_DISTINCT_MOVE_BUCKETS:
        print(f"Not enough distinct move buckets. Found: {puzzle_min_buckets}. Need: {MIN_DISTINCT_MOVE_BUCKETS}. Skipping this puzzle.{os.linesep}")
        return

    # Create a comma-separated list of moves with evaluations
    moves_str = ', '.join([f"{move} {score}" for move, score in top_moves])

    # Write the result to the CSV file
    writer.writerow({
        'LichessPuzzleId': puzzle_id,
        'FEN': fen,
        'Rating': rating,
        'Moves': moves_str
    })
    
    print(f"Successfully processed Puzzle ID: {puzzle_id}{os.linesep}")

def main():
    # Create directory if it doesn't exist
    output_dir = os.path.dirname(CSV_OUTPUT_FILE_PATH)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Open output file for writing
    with open(CSV_OUTPUT_FILE_PATH, 'w', newline='') as csvfile:
        fieldnames = ['LichessPuzzleId', 'FEN', 'Rating', 'Moves']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Write the header only if the file is empty
        if os.stat(CSV_OUTPUT_FILE_PATH).st_size == 0:
            writer.writeheader()
        
        process_input_file(LICHESS_PUZZLE_FILE, writer, LICHESS_PUZZLE_FILE_OFFSET, LICHESS_PUZZLE_FILE_NUM_TO_PROCESS)


if __name__ == "__main__":
    main()
