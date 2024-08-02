<p align="center">
<img src="https://github.com/mobeigi/chessort/blob/main/.github/logo/logo.svg?raw=true" height="110px" width="auto"/>
<br/>
<h3 align="center">Chessort Server</h3>
<p align="center">Generating games and validating solutions</p>
<h2></h2>
<br />

<p align="center">
<a href="../../releases"><img src="https://img.shields.io/github/release/mobeigi/chessort.svg?style=flat-square" /></a>
<a href="../../actions"><img src="https://img.shields.io/github/actions/workflow/status/mobeigi/chessort/workflow.yml?style=flat-square" /></a>
<a href="../../issues"><img src="https://img.shields.io/github/issues/mobeigi/chessort.svg?style=flat-square" /></a>
<a href="../../pulls"><img src="https://img.shields.io/github/issues-pr/mobeigi/chessort.svg?style=flat-square" /></a> 
<a href="LICENSE.md"><img src="https://img.shields.io/github/license/mobeigi/chessort.svg?style=flat-square" /></a>
</p>

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
