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
    LichessPuzzleId,FEN,Rating,PreLastMovePositionEvaluation,LastMove,CurrentPositionEvaluation,EvaluatedMoves
    <LichessPuzzleId>,<FEN>,<Rating>,<PreLastMovePositionEvaluation>,<LastMove>,<CurrentPositionEvaluation>,"<UciMove> <Eval>,<UciMove> <Eval>,..."
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

def insert_puzzle(cursor, lichess_puzzle_id, fen, rating, pre_last_move_eval, last_uci_move, current_pos_eval):
    """ Insert a puzzle into the Positions table """
    query = """INSERT INTO Positions (LichessPuzzleId, FEN, Rating, PreLastMovePositionEval, LastUciMove, CurrentPositionEval) 
               VALUES (%s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, (lichess_puzzle_id, fen, rating, pre_last_move_eval, last_uci_move, current_pos_eval))
    return cursor.lastrowid

def insert_move(cursor, position_id, uci_move, engine_eval, engine_overall_rank):
    """ Insert a move into the Moves table """
    query = "INSERT INTO Moves (PositionID, UciMove, EngineEval, EngineOverallRank) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (position_id, uci_move, engine_eval, engine_overall_rank))

def parse_moves(moves_str, turn_player):
    """ Parse the moves string into a list of tuples (uci_move, engine_eval, engine_overall_rank) """
    moves = moves_str.split(',')
    parsed_moves = []
    for engine_overall_rank, move in enumerate(moves, start=1):
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
            fen = row['FEN']
            lichess_puzzle_id = row['LichessPuzzleId']
            rating = int(row['Rating'])

            # Determine the turn player from the FEN string
            board = chess.Board(fen)
            turn_player = board.turn
            opponent_player = not turn_player  # Opponent player is the opposite of the turn player

            # Set variables
            pre_last_move_eval = convert_to_global_eval(row['PreLastMovePositionEvaluation'], opponent_player) 
            current_pos_eval = convert_to_global_eval(row['CurrentPositionEvaluation'], turn_player)
        
            # Parse the last move
            last_move_parsed = parse_moves(row['LastMove'], opponent_player)
            last_uci_move, _, _ = last_move_parsed[0]  # Get the first (and only) parsed move

            # Insert puzzle and get the generated ID
            position_id = insert_puzzle(cursor, lichess_puzzle_id, fen, rating, pre_last_move_eval, last_uci_move, current_pos_eval)

            # Parse moves and insert them
            moves = parse_moves(row['EvaluatedMoves'], turn_player)
            for uci_move, engine_eval, engine_overall_rank in moves:
                insert_move(cursor, position_id, uci_move, engine_eval, engine_overall_rank)

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
