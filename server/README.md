# Chessort Server

## Description
This is the Chessort Server responsible for generating games and validating solutions.
It interacts with the backend database and provides a public API for consumption by apps.

## Requirements
- Python 3

## Setup

1. **Copy and Configure .env File**:
    - Copy the `.env.example` file to `.env`:
      ```sh
      cp .env.example .env
      ```
    - Populate the `.env` file with your details.

2. **Create virtual environment**:
    - Create a virtual environment by running:
      ```sh
      python -m venv ./venv
      ```

3. **Install Dependencies**:
    - Ensure you have the required Python packages by running:
      ```sh
      pip install -r requirements.txt
      ```

## Quick Start

#### Run in debug mode (development)

#### `python -m chessortserver --debug`

#### Run in production mode

#### `python -m chessortserver`

#### Run all tests

#### `pytest`
