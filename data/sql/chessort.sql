-- Sets up Chessort DB schema for puzzles and moves with necessary indexes.

CREATE DATABASE IF NOT EXISTS chessort;
USE chessort;

-- Create the Puzzles table
CREATE TABLE IF NOT EXISTS Puzzles (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    LichessPuzzleId VARCHAR(10) NOT NULL,
    FEN TEXT NOT NULL,
    Rating INT
);

-- Create the Moves table
CREATE TABLE IF NOT EXISTS Moves (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PuzzleID INT,
    UciMove VARCHAR(10) NOT NULL,
    EngineEval VARCHAR(10) NOT NULL,
    EngineOverallRank INT,
    FOREIGN KEY (PuzzleID) REFERENCES Puzzles(ID)
);

-- Create indexes for optimizing queries
CREATE INDEX idx_moves_puzzleid ON Moves(PuzzleID);
CREATE INDEX idx_moves_eval ON Moves(EngineEval);
