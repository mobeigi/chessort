# Data Ingestion

## Overview

This folder contains the script for ingesting chessort puzzle data into the MySQL database.

## Setup

1. **Copy and Configure .env File**:
    - Copy the `.env.example` file to `.env`:
      ```sh
      cp .env.example .env
      ```
    - Populate the `.env` file with your details.

2. **Create virtual environment**:
    ```sh
    python -m venv ./venv
    ```

3. **Activate the virtual environment**:
    ```sh
    # On Windows
    .\venv\Scripts\activate

    # On Unix
    source venv/bin/activate
    ```

4. **Install Dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

## Ingestion Script

The `ingestion.py` script processes a CSV file containing chessort puzzles and inserts the data into the database. The input CSV file should be the output from the Chessort `generation` process. 

For more details on the script's functionality, refer to the header comments within the `ingestion.py` file.

## Usage

Run the script with the following command:
```sh
python ingestion.py <chessort_csv_file_path>
```
