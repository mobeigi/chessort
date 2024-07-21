"""
ingestion.py - Ingest CSV data into MySQL database

This script reads a CSV file containing chess puzzles and their respective moves, processes the data,
and inserts it into a MySQL database. The script converts engine evaluations to global evaluations 
based on the turn player indicated in the FEN string.

Requirements:
- Python 3.x
- mysql-connector-python library
- python-dotenv library

Configuration:
- Database configuration is loaded from environment variables using a .env file.

Usage:
    python ingestion.py <csv_file_path>

CSV File Format:
    LichessPuzzleId,FEN,Rating,Moves
    <LichessPuzzleId>,<FEN>,<Rating>,"<UciMove> <Eval>,<UciMove> <Eval>,..."

Example:
    LichessPuzzleId,FEN,Rating,Moves
    1Xznj,1r2r3/pp3Qp1/2n3pk/4q3/6R1/P1N1P1PP/1P5K/8 b - - 2 32,1493,"g6g5 +410 e5f6 +48 e5h5 +46 e5f5 0 e8e6 0 e5d6 0 c6e7 -325 h6h7 -404 e5g5 -609 e5g3 #-23 e5e4 #-3 e5e6 #-2 a7a6 #-1 b7b6 #-1 a7a5 #-1 b7b5 #-1 c6b4 #-1 c6d4 #-1 c6a5 #-1 c6d8 #-1 b8a8 #-1 b8c8 #-1 b8d8 #-1 e8e7 #-1 e8c8 #-1 e8d8 #-1 e8f8 #-1 e8g8 #-1 e8h8 #-1 e5c3 #-1 e5e3 #-1 e5d4 #-1 e5f4 #-1 e5a5 #-1 e5b5 #-1 e5c5 #-1 e5d5 #-1 e5c7 #-1 e5e7 #-1 h6h5 #-1"
"""
import csv
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import chess

load_dotenv()

db_config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_DATABASE')
}

def connect_to_db():
    """ Connect to MySQL database """
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None

def close_connection(connection):
    """ Close the database connection """
    if connection.is_connected():
        connection.close()

def insert_puzzle(cursor, lichess_puzzle_id, fen, rating):
    """ Insert a puzzle into the Puzzles table """
    query = "INSERT INTO Puzzles (LichessPuzzleId, FEN, Rating) VALUES (%s, %s, %s)"
    cursor.execute(query, (lichess_puzzle_id, fen, rating))
    return cursor.lastrowid

def insert_move(cursor, puzzle_id, uci_move, engine_eval, engine_overall_rank):
    """ Insert a move into the Moves table """
    query = "INSERT INTO Moves (PuzzleID, UciMove, EngineEval, EngineOverallRank) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (puzzle_id, uci_move, engine_eval, engine_overall_rank))

def parse_moves(moves_str, turn_player):
    """ Parse the moves string into a list of tuples (uci_move, engine_eval, engine_overall_rank) """
    moves = moves_str.split(',')
    parsed_moves = []
    for engine_overall_rank, move in enumerate(moves):
        uci_move, engine_eval = move.split(' ')
        engine_eval = convert_to_global_eval(engine_eval, turn_player)
        parsed_moves.append((uci_move, engine_eval, engine_overall_rank))
    return parsed_moves

def convert_to_global_eval(engine_eval, turn_player):
    """ Convert the engine evaluation to global evaluation """
    if engine_eval.startswith('#'):
        mate_value = int(engine_eval[1:])
        if turn_player == chess.BLACK:
            mate_value = -mate_value
        return f"#{mate_value}"
    eval_value = int(engine_eval)
    if turn_player == chess.BLACK:
        eval_value = -eval_value
    return f"{eval_value:+}"

def process_csv(file_path):
    """ Process the CSV file and insert data into the database """
    connection = connect_to_db()
    if connection is None:
        return

    cursor = connection.cursor()

    with open(file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            lichess_puzzle_id = row['LichessPuzzleId']
            fen = row['FEN']
            rating = int(row['Rating'])
            moves_str = row['Moves']
            
            # Determine the turn player from the FEN string
            board = chess.Board(fen)
            turn_player = board.turn

            # Insert puzzle and get the generated ID
            puzzle_id = insert_puzzle(cursor, lichess_puzzle_id, fen, rating)

            # Parse moves and insert them
            moves = parse_moves(moves_str, turn_player)
            for uci_move, engine_eval, engine_overall_rank in moves:
                insert_move(cursor, puzzle_id, uci_move, engine_eval, engine_overall_rank)

    connection.commit()
    cursor.close()
    close_connection(connection)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python ingestion.py <csv_file_path>")
    else:
        file_path = sys.argv[1]
        process_csv(file_path)
