<div align="center">
  <img src="https://github.com/mobeigi/chessort/blob/main/.github/logo/logo.svg?raw=true" height="110px" width="auto"/>
  <br/>
  <h3 align="center">Chessort</h3>
  <p align="center">Chess puzzle sorting game.</p>
  <h2></h2>
  <br />
  
  [![Issues][issues-badge]][issues-link]
  [![Pull Requests][pulls-badge]][pulls-link]  
  [![Website][website-badge]][website-link]
  [![Discord][discord-badge]][discord-link]
  [![License][license-badge]][license-link]
</div>

## Description
Chessort is a Chess puzzle game where you sort moves based on the chess engine's evaluation.

<div align="center">
  <img src="https://github.com/mobeigi/chessort/blob/main/.github/screenshots/chessort-game-screenshot.png?raw=true" width="auto"/>
</div>

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

<!-- Variables -->
[issues-badge]: https://img.shields.io/github/issues/mobeigi/chessort.svg?style=flat-square
[issues-link]: ../../issues

[pulls-badge]: https://img.shields.io/github/issues-pr/mobeigi/chessort.svg?style=flat-square
[pulls-link]: ../../pulls

[website-badge]: https://img.shields.io/website?url=https%3A%2F%2Fchessort.com&style=flat-square
[website-link]: http://chessort.com/

[discord-badge]: https://img.shields.io/discord/1266704159894409266?style=flat-square&logo=Discord&logoColor=ffffff&label=Discord
[discord-link]: https://discord.gg/pjJUG3CWnc

[license-badge]: https://img.shields.io/github/license/mobeigi/chessort.svg?style=flat-square
[license-link]: LICENSE.md
