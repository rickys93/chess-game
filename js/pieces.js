class Piece {
    constructor(colour, position) {
        this.colour = colour;
        this.position = position;
        this.pendingPosition = null;
    }

    squareOnBoard(row, col, board) {
        return 0 <= row && row < board.length && 0 <= col && col < board.length;
    }

    select(board) {
        this.availableMoves(board);
    }

    checkSquareNeedsAdding(piece, row, col) {
        if (piece) {
            if (piece.colour !== this.colour) {
                this.possibleTakes.add(piece.position);
            } else {
                this.ownPieces.add(piece.position);
            }
            return false;
        } else {
            this.possibleMoves.add([row, col]);
        }
        return true;
    }

    moveOnHtml() {
        const fromIndex = convertDbToHtml(this.position);
        const toIndex = convertDbToHtml(this.pendingPosition);

        clearElementImg(boardSquares[fromIndex]);

        addImgToElement(this, boardSquares[toIndex]);
    }

    takeOnHtml() {
        const fromIndex = convertDbToHtml(this.position);
        const toIndex = convertDbToHtml(this.pendingPosition);

        clearElementImg(boardSquares[fromIndex]);
        clearElementImg(boardSquares[toIndex]);

        addImgToElement(this, boardSquares[toIndex]);
    }

    confirmMove() {
        if (game.targettedPiece) {
        }

        // TO DO:
        // This is where we make the api call to validate the move

        game.board = moveOnBoard(game.board, this, this.pendingPosition);

        this.position = this.pendingPosition;
        this.pendingPosition = null;

        game.endPlayerTurn();

        confirmContainer.style.visibility = "hidden";
    }

    get url() {
        let url;
        if (this.colour === "b") {
            url = this.imageUrl;
        } else {
            url = this.imageUrl.slice(0, -4) + "-white.png";
        }
        return url;
    }
}

class Pawn extends Piece {
    constructor(colour, position) {
        super(colour, position);
        this.direction = this.findDirection();
        this.imageUrl = "./images/pawn.png";
    }

    findDirection() {
        if (this.colour === "w") {
            return 1;
        } else {
            return -1;
        }
    }

    availableMoves(board) {
        this.possibleMoves = new Set();
        this.possibleTakes = new Set();
        this.ownPieces = new Set();
        const row = this.position[0];
        const col = this.position[1];

        for (let i = 1; i <= 2; i++) {
            const piece = board[row + i * this.direction][col];
            if (piece) {
                break;
            } else {
                this.possibleMoves.add([row + i * this.direction, col]);
            }
        }

        const potentialTakes = [
            [row + 1 * this.direction, col + 1],
            [row + 1 * this.direction, col - 1],
        ];
        potentialTakes.forEach((coor) => {
            let row = coor[0];
            let col = coor[1];
            if (!this.squareOnBoard(row, col, board)) {
                return;
            }
            const piece = board[row][col];

            if (piece) {
                if (piece.colour !== this.colour) {
                    this.possibleTakes.add([row, col]);
                } else {
                    this.ownPieces.add([row, col]);
                }
            }
        });
    }
}

class King extends Piece {
    constructor(colour, position) {
        super(colour, position);
        this.imageUrl = "./images/king.png";
        this.directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ];
    }

    availableMoves(board) {
        this.ownPieces = new Set();
        this.possibleMoves = new Set();
        this.possibleTakes = new Set();
        this.directions.forEach((d) => {
            let row = this.position[0] + d[0];
            let col = this.position[1] + d[1];

            if (!this.squareOnBoard(row, col, board)) {
                return;
            }
            const piece = board[row][col];
            this.checkSquareNeedsAdding(piece, row, col);
        });
    }
}

class AgilePiece extends Piece {
    constructor(colour, position) {
        super(colour, position);
    }

    availableMoves(board) {
        this.ownPieces = new Set();
        this.possibleMoves = new Set();
        this.possibleTakes = new Set();
        this.directions.forEach((d) => {
            let row = this.position[0] + d[0];
            let col = this.position[1] + d[1];
            while (
                0 <= row &&
                row < board.length &&
                0 <= col &&
                col < board.length
            ) {
                let piece = board[row][col];
                if (!this.checkSquareNeedsAdding(piece, row, col)) {
                    break;
                }
                row += d[0];
                col += d[1];
            }
        });
    }
}

class Knight extends Piece {
    constructor(colour, position) {
        super(colour, position);
        this.imageUrl = "./images/knight.png";
        this.potentialMoves = [
            [2, 1],
            [1, 2],
            [-2, 1],
            [1, -2],
            [-1, 2],
            [2, -1],
            [-1, -2],
            [-2, -1],
        ];
    }

    availableMoves(board) {
        this.ownPieces = new Set();
        this.possibleMoves = new Set();
        this.possibleTakes = new Set();
        this.potentialMoves.forEach((d) => {
            const row = this.position[0] + d[0];
            const col = this.position[1] + d[1];

            if (!this.squareOnBoard(row, col, board)) {
                return;
            }

            const piece = board[row][col];

            this.checkSquareNeedsAdding(piece, row, col);
        });
    }
}

class Bishop extends AgilePiece {
    constructor(colour, position) {
        super(colour, position);
        this.imageUrl = "./images/bishop.png";
        this.directions = [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ];
    }
}

class Rook extends AgilePiece {
    constructor(colour, position) {
        super(colour, position);
        this.imageUrl = "./images/rook.png";
        this.directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ];
    }
}

class Queen extends AgilePiece {
    constructor(colour, position) {
        super(colour, position);
        this.imageUrl = "./images/queen.png";
        this.directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ];
    }
}
