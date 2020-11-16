# zChess

An individually developed chess engine for implementing chess algorithms and personal tactic study.  zChess is currently in pre-alpha and has yet to have any minor releases yet. It is built purely using Vanilla JavaScript, HTML, and CSS.

## Contents
- `index.html` The landing page for the app
- `style.css` Basic CSS formatting to display board
- `functionality.js` The main logic controller
- `inputHandler.js` The input manager
- an `img` directory containing the piece images and their respective `.psd` source files

## Features
All chess rules for legal moves are currently implemented in the engine including:
- Check
  - Pieces can't move if it doesn't get their king out of check
- Castling
  - Cannot castle if King or any spaces in between are threatening check
- En Passant

## Installation
- Clone the repository to your local machine
- Open `index.html` in your web browser.

*Thats it!*

## Planned updates *(In order of precedence)*
- Checkmate / Stalemate detection
- Code refactoring
- Mobile support
- Move King to Rook in order to Castle 
  - *Note :* This is an additional movement option, castling is already possible currently by moving two spaces to either side of the king
- Show potential moves
- AI Opponent
- Engine analysis
- Multiplayer Integration *(This may require an engine rebuild)*
  - Chat room
  - Matchmaking

### Known Bugs *(as of 11/15/2020)*
- Piece not aligning with mouse position

## Credits
zChess was started by Jacob Pradels in 2020 and thus far has been a single person development however if you are interested in contributing it is encouraged.
