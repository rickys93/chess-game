class Game {
    constructor(board) {
        this.board = new Board(board);
        this.currentPlayer = new Player("w");
        this.otherPlayer = new Player("b");
        this.selectedPiece = null;
        this.targettedPiece = null;
        this.ui = new UI(this);
    }

    newGame() {
        this.initializeGame();
        this.startPlayerTurn();
    }

    initializeGame() {
        this.ui.initialize();
        for (let row = 0; row < this.board.state.length; row++) {
            for (let col = 0; col < this.board.state[0].length; col++) {
                const piece = this.board.state[row][col];

                if (piece && piece.constructor.name === "King") {
                    if (this.currentPlayer.colour === piece.colour) {
                        this.currentPlayer.king = piece;
                    } else {
                        this.otherPlayer.king = piece;
                    }
                }
            }
        }
    }

    handleClick(row, col) {
        const piece = this.board.state[row][col];

        // piece already selected - find out if move possible
        if (this.selectedPiece) {
            if (piece) {
                // piece already selected - find out if trying legal take (piece in possibleTakes)
                if (
                    piece.colour !== this.currentPlayer.colour &&
                    arrayInSet(piece.position, this.selectedPiece.possibleTakes)
                ) {
                    this.move(piece.position, true);
                    return;
                } else if (
                    piece.colour === this.currentPlayer.colour &&
                    piece !== this.selectedPiece
                ) {
                    this.restartMove();
                    this.selectPiece(piece);
                    return;
                }
            } else {
                // clicked empty square, find out if legal move
                if (arrayInSet([row, col], this.selectedPiece.possibleMoves)) {
                    // legal move
                    this.move([row, col]);
                    return;
                }
            }
            // move not legal move, cancel the previous selection
            this.restartMove();
        } else {
            // piece not selected yet
            if (piece) {
                // if piece is same colour as this.currentPlayer select it
                if (piece.colour === this.currentPlayer.colour) {
                    this.selectPiece(piece);
                    return;
                }
            }
        }
    }

    selectPiece(piece) {
        piece.select(this.board.state);
        this.selectedPiece = piece;

        this.ui.selectPiece();
    }

    restartMove() {
        this.selectedPiece = null;
        this.targettedPiece = null;
        this.ui.restartMove();
    }

    move([row, col], take = false) {
        this.board.pendingMove(this.selectedPiece, [row, col]);
        this.selectedPiece.pendingMove = [row, col];

        // before we move piece, need to check it doesn't lead to check
        const check = this.checkForCheck(this.board.pendingState);
        if (check) {
            // reset pending board and cancel move
            this.board.cancelPendingMove(this.selectedPiece);
            return;
        }

        this.confirmMove(take);

        this.endPlayerTurn();
    }

    confirmMove(take) {
        // confirm move
        const from = this.selectedPiece.position;
        const to = this.selectedPiece.pendingMove;
        this.board.confirmMove(this.selectedPiece);
        this.selectedPiece.position = this.selectedPiece.pendingMove;
        this.selectedPiece.pendingMove = null;

        if (take) {
            this.ui.takePiece(from, to);
        } else {
            this.ui.movePiece(from, to);
        }
        this.selectedPiece = null;
    }

    startPlayerTurn() {
        this.currentPlayer.check = this.checkForCheck(this.board.state);

        this.ui.setBoard();
    }

    endPlayerTurn() {
        // switch currentPlayer and otherPlayer and start new round
        [this.currentPlayer, this.otherPlayer] = [
            this.otherPlayer,
            this.currentPlayer,
        ];

        this.startPlayerTurn();
    }

    gameOver() {
        const winner = this.otherPlayer;
        const winMethod = "Checkmate";
        this.ui.gameOver(winner, winMethod);
    }

    checkForCheck(board) {
        let totalPossibleMoves = new Set();
        let totalPossibleTakes = new Set();
        let totalOwnPieces = new Set();
        let check = false;
        let checkMate = false;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                const piece = board[row][col];

                // checking if there is a piece on the square
                if (piece) {
                    // making sure it's the other player's piece
                    if (piece.colour === this.currentPlayer.colour) {
                        continue;
                    }

                    // going to add up all the other player's possible moves into one array
                    piece.availableMoves(board);

                    totalPossibleMoves = new Set([
                        ...totalPossibleMoves,
                        ...piece.possibleMoves,
                    ]);
                    totalPossibleTakes = new Set([
                        ...totalPossibleTakes,
                        ...piece.possibleTakes,
                    ]);
                    totalOwnPieces = new Set([
                        ...totalOwnPieces,
                        ...piece.ownPieces,
                    ]);
                }
            }
        }
        // now we can check if the king is in check
        if (arrayInSet(this.currentPlayer.king.position, totalPossibleTakes)) {
            check = true;
        } else {
            check = false;
            return check;
        }

        // during a player's turn, we do not need to check for checkmate
        if (this.selectedPiece) {
            return check;
        }

        // if king is in check, we need to see if it can move to any squares
        // find all king's possible moves and find if any of them are not in the arrays
        this.currentPlayer.king.availableMoves(board);
        const totalKingMoves = new Set([
            ...this.currentPlayer.king.possibleMoves,
            ...this.currentPlayer.king.possibleTakes,
        ]);
        const totalOpponentMoves = new Set([
            ...totalPossibleMoves,
            ...totalPossibleTakes,
            ...totalOwnPieces,
        ]);

        checkMate = true;
        totalKingMoves.forEach((move) => {
            if (!arrayInSet(move, totalOpponentMoves)) {
                checkMate = false;
            }
        });

        if (!checkMate) {
            return check;
        }

        // player in check mate, game over - this.otherPlayer is the winner
        this.gameOver();
    }
}
