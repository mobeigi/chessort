<p align="center">
<img src="https://github.com/mobeigi/chessort/blob/main/.github/logo/logo.svg?raw=true" height="110px" width="auto"/>
<br/>
<h3 align="center">Chessort</h3>
<p align="center">Chess puzzle sorting game.</p>
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
Chessort is a Chess puzzle game where you sort moves based on the chess engine's evaluation.

## Directory Structure

- **app/**: Contains the React frontend for Chessort.
  - For more details, see the [README](app/README.md) in the `app` directory.

- **server/**: Contains the server responsible for generating games and validating solutions.
  - For more details, see the [README](server/README.md) in the `server` directory.

- **data/**: Contains scripts for data generation and ingestion.
  - **generation/**: Scripts for generating Chessort data CSV's data.
    - For more details, see the [README](data/generation/README.md) in the `generation` directory.
  - **ingestion/**: Scripts for ingesting generated Chessort data into a database.
    - For more details, see the [README](data/ingestion/README.md) in the `ingestion` directory.
  - **sql/**: Contains SQL scripts for setting up the database schema.

## Contributions
Contributions are always welcome!  
Just make a [pull request](../../pulls).

## License
TBA
