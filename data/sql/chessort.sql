-- Sets up Chessort DB schema

CREATE DATABASE IF NOT EXISTS chessort;
USE chessort;

-- Create the Positions table
CREATE TABLE IF NOT EXISTS Positions (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    LichessPuzzleId VARCHAR(10) NOT NULL,
    FEN TEXT NOT NULL UNIQUE,
    Rating INT,
    PreLastMovePositionEval VARCHAR(10),
    LastUciMove VARCHAR(10),
    CurrentPositionEval VARCHAR(10)
);

-- Create the Moves table
CREATE TABLE IF NOT EXISTS Moves (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PositionID INT NOT NULL,
    UciMove VARCHAR(10) NOT NULL,
    EngineEval VARCHAR(10) NOT NULL,
    EngineOverallRank INT,
    FOREIGN KEY (PositionID) REFERENCES Positions(ID) ON DELETE CASCADE
);

-- Create the GamesPlayed table
CREATE TABLE IF NOT EXISTS GamesPlayed (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PositionID INT NOT NULL,
    MoveHash VARCHAR(23) NOT NULL, -- Comma-separated list of 4 sorted UCI moves, max 23 chars
    UNIQUE(PositionID, MoveHash), -- Ensure each combination of PositionID and MoveHash is unique
    FOREIGN KEY (PositionID) REFERENCES Positions(ID) ON DELETE CASCADE
);

-- Create the PositionMetadata table
CREATE TABLE IF NOT EXISTS PositionMetadata (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    PositionID INT NOT NULL,
    Hits INT DEFAULT 0,
    FOREIGN KEY (PositionID) REFERENCES Positions(ID) ON DELETE CASCADE
);

-- Create the GamesPlayedMetadata table
CREATE TABLE IF NOT EXISTS GamesPlayedMetadata (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    GamesPlayedID INT NOT NULL,
    Hits INT DEFAULT 0,
    Difficulty INT DEFAULT NULL, -- Integer value representing the difficulty between 0 and 100
    FOREIGN KEY (GamesPlayedID) REFERENCES GamesPlayed(ID) ON DELETE CASCADE
);

-- Create indexes for optimizing queries
CREATE INDEX idx_moves_positionid ON Moves(PositionID);
CREATE INDEX idx_gamesplayed_positionid ON GamesPlayed(PositionID);
CREATE INDEX idx_positionmetadata_positionid ON PositionMetadata(PositionID);
CREATE INDEX idx_gamesplayedmetadata_gamesplayedid ON GamesPlayedMetadata(GamesPlayedID);
CREATE INDEX idx_gamesplayedmetadata_difficulty ON GamesPlayedMetadata(Difficulty);
