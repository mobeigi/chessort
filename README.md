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

- [app](app): Contains the React frontend for Chessort.
- [server](server): Contains the server responsible for generating games and validating solutions.
- [data](data): Contains scripts for data generation and ingestion.
  - [generation](data/generation): Scripts for generating Chessort data CSV's data.
  - [ingestion](data/ingestion): Scripts for ingesting generated Chessort data into a database.
  - [sql](data/sql): Contains SQL scripts for setting up the database schema.

## Contributions
Contributions are always welcome!  
Just make a [pull request](../../pulls).

## Credits

- [Lichess Open Database](https://database.lichess.org/)
- [Lichess Chessground](https://github.com/lichess-org/chessground)
- [Stockfish](https://stockfishchess.org/) 

See [CREDITS.md](CREDITS.md) for full credits.

## License

### Chessort

Chessort is licensed under the [GNU General Public License v3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl-3.0.en.html).

### Lichess Open Database

This project uses chess data from the [Lichess Open Database](https://database.lichess.org/). The data is available under the [Creative Commons Zero (CC0) License](https://creativecommons.org/publicdomain/zero/1.0/).

### Lichess Chessground

This project utilizes [Lichess Chessground](https://github.com/lichess-org/chessground) for rendering the chessboard. Chessground is licensed under the [MIT License](https://opensource.org/licenses/MIT).

### Stockfish

This project leverages the  [Stockfish](https://stockfishchess.org/) chess engine for analysis. Stockfish is licensed under the [GNU General Public License v3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl-3.0.en.html).
