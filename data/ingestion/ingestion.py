import csv
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

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

def insert_move(cursor, puzzle_id, uci_move, eval, rank):
    """ Insert a move into the Moves table """
    query = "INSERT INTO Moves (PuzzleID, UciMove, Eval, Rank) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (puzzle_id, uci_move, eval, rank))

def parse_moves(moves_str):
    """ Parse the moves string into a list of tuples (uci_move, eval, rank) """
    moves = moves_str.split(',')
    parsed_moves = []
    for rank, move in enumerate(moves):
        uci_move, eval = move.split(' ')
        parsed_moves.append((uci_move, eval, rank))
    return parsed_moves

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

            # Insert puzzle and get the generated ID
            puzzle_id = insert_puzzle(cursor, lichess_puzzle_id, fen, rating)

            # Parse moves and insert them
            moves = parse_moves(moves_str)
            for uci_move, eval, rank in moves:
                insert_move(cursor, puzzle_id, uci_move, eval, rank)

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
