const boardSquares = document.getElementsByClassName("cell");

class Player {
    constructor(colour) {
        this.colour = colour;
    }
}

class Game {
    constructor() {
        this.currentPlayer = new Player("w");
        this.otherPlayer = new Player("b");
        this.board = [
            ["Rw", "Nw", "Bw", "Qw", ".", "Bw", "Nw", "Rw"],
            ["Pw", "Pw", "Pw", "Pw", ".", "Pw", ".", "Pw"],
            [".", ".", ".", "Pw", ".", ".", ".", "Pb"],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", "Pw", "Pw", ".", ".", ".", "."],
            [".", ".", "Pw", "Kw", "Pw", ".", ".", "."],
            ["Pb", "Pb", "Pb", ".", "Pb", "Pb", "Pb", "Pb"],
            ["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"],
        ];
    }

    newGame() {
        this.initializeGame();

        this.startPlayerTurn();
    }

    initializeGame() {
        for (let i = 0; i < boardSquares.length; i++) {
            let [x, y] = convertHtmlToDb(i);

            const square = this.board[x][y];

            if (square[0] === "K") {
                const colour = square[1];
                if (this.currentPlayer.colour === colour) {
                    this.currentPlayer.kingPosition = [x, y];
                }
            }
        }
    }

    startPlayerTurn() {
        this.checkForCheck();

        this.startRoundEventListeners();

        [this.currentPlayer, this.otherPlayer] = [
            this.otherPlayer,
            this.currentPlayer,
        ];
    }

    startRoundEventListeners() {
        // TO DO: I think we need to change the way we do this
        // we should use this.board to set the html pieces on the board correctly
        // then add event listeners at the same time
        // for row in this.board... etc
        for (let i = 0; i < boardSquares.length; i++) {
            let [x, y] = convertHtmlToDb(i);

            const square = this.board[x][y];

            if (square !== ".") {
                const pieceColour = square[1];
                if (pieceColour !== this.currentPlayer.colour) {
                    continue;
                }

                const newCell = boardSquares[i].cloneNode(true);
                boardSquares[i].parentNode.replaceChild(
                    newCell,
                    boardSquares[i]
                );

                boardSquares[i].addEventListener("click", findAvailableSquares);
            }
        }
    }

    checkForCheck() {
        let totalPossibleMoves = [];
        let totalPossibleTargets = [];
        let totalOwnPieces = [];
        for (let i = 0; i < boardSquares.length; i++) {
            let [x, y] = convertHtmlToDb(i);

            const square = this.board[x][y];

            // checking if there is a piece on the square
            if (square !== ".") {
                // making sure it's the other player's piece
                const pieceColour = square[1];
                if (pieceColour === this.currentPlayer.colour) {
                    continue;
                }

                const pieceString = game.board[x][y][0];
                const piece = new pieceObjects[pieceString](pieceColour);
                // going to add up all the other player's possible moves into one array
                const { possibleMoves, possibleTargets, ownPieces } =
                    piece.availableMoves([x, y], game.board);

                totalPossibleMoves = totalPossibleMoves.concat(possibleMoves);
                totalPossibleTargets =
                    totalPossibleTargets.concat(possibleTargets);
                totalOwnPieces = totalOwnPieces.concat(ownPieces);
            }
        }
        // now we can check if the king is in check
        if (
            arrayInArray(this.currentPlayer.kingPosition, totalPossibleTargets)
        ) {
            this.currentPlayer.check = true;
        } else {
            this.currentPlayer.check = false;
            return;
        }

        // if king is in check, we need to see if it can move to any squares
        // find all king's possible moves and find if any of them are not in the arrays
        const king = new King(this.currentPlayer.colour);
        const { possibleMoves, possibleTargets } = king.availableMoves(
            this.currentPlayer.kingPosition,
            this.board
        );
        const totalKingMoves = possibleMoves.concat(possibleTargets);
        const totalOpponentMoves = totalPossibleMoves.concat(
            totalPossibleTargets,
            totalOwnPieces
        );

        this.currentPlayer.checkMate = true;
        totalKingMoves.forEach((m) => {
            if (!arrayInArray(m, totalOpponentMoves)) {
                this.currentPlayer.checkMate = false;
            }
        });

        if (!this.currentPlayer.checkMate) {
            return;
        }

        // player in check mate, game over - this.otherPlayer is the winner
        console.log("GAME OVER");
    }
}

const pieceObjects = {
    P: Pawn,
    N: Knight,
    B: Bishop,
    Q: Queen,
    R: Rook,
    K: King,
};

const game = new Game();
game.newGame();

function convertDbToHtml(coor) {
    return coor[0] * 8 + coor[1];
}

function convertHtmlToDb(coor) {
    const y = coor % 8;
    coor -= y;
    const x = coor / 8;
    return [x, y];
}

function arrayInArray(innerArr, outerArr) {
    for (let i = 0; i < outerArr.length; i++) {
        if (JSON.stringify(innerArr) === JSON.stringify(outerArr[i])) {
            return true;
        }
    }
    return false;
}

function clearEventListener(element) {
    const newCell = element.cloneNode(true);
    element.parentNode.replaceChild(newCell, element);
}

function clearAllEventListeners() {
    for (let i = 0; i < boardSquares.length; i++) {
        clearEventListener(boardSquares[i]);
    }
}

function getPieceObjectFromCoordinates(x, y) {
    const pieceString = game.board[x][y][0];
    const pieceColour = game.board[x][y][1];

    const piece = new pieceObjects[pieceString](pieceColour);
    return piece;
}

function getCoordinatesFromEvent(e) {
    const square = e.target;
    const x = parseInt(square.id[0]);
    const y = parseInt(square.id[1]);
    return [x, y];
}

function findAvailableSquares(e) {
    [x, y] = getCoordinatesFromEvent(e);

    game.currentPiece = [x, y];

    const piece = getPieceObjectFromCoordinates(x, y);

    const { possibleMoves, possibleTargets, ownPieces } = piece.availableMoves(
        [x, y],
        game.board
    );

    clearAllEventListeners();

    possibleMoves.forEach((sq) => {
        const index = convertDbToHtml(sq);

        boardSquares[index].querySelector(".target").style.display = "inline";

        boardSquares[index].addEventListener("click", movePiece);
    });

    possibleTargets.forEach((sq) => {
        const index = convertDbToHtml(sq);

        boardSquares[index].querySelector(".target").style.backgroundColor =
            "red";
        boardSquares[index].querySelector(".target").style.display = "inline";
    });
}

function movePiece(e) {
    const [px, py] = game.currentPiece;
    const piece = getPieceObjectFromCoordinates(x, y);
    [ex, ey] = getCoordinatesFromEvent(e);

    // do this and then clear all event listeners while we wait to confirm
    // if not confirmed, reset the round from the game.board
    movePieceOnHtml([px, py], [ex, ey]);

    // I think we don't want to move the piece on the board yet - just html
    // then we would just need to reset the html board and startRoundEventListeners()
    // if the move is not confirmed

    // Once confirmed we can move the piece on the board and start next round.
    movePieceOnBoard([px, py], [ex, ey]);
}

function movePieceOnBoard(from, to) {
    const pieceString = board[from[0]][from[1]];
    board[from[0]][from[1]] = ".";
    board[to[0]][to[1]] = pieceString;
}

function movePieceOnHtml(from, to) {}
