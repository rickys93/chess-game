class Piece {
    constructor(colour, position) {
        this.colour = colour;
        this.position = position;
    }

    squareOnBoard(x, y, board) {
        return 0 <= x && x < board.length && 0 <= y && y < board.length;
    }

    checkSquareNeedsAdding(
        x,
        y,
        square,
        possibleMoves,
        possibleTargets,
        ownPieces
    ) {
        if (square !== ".") {
            if (square[1] !== this.colour) {
                possibleTargets.push([x, y]);
            } else {
                ownPieces.push([x, y]);
            }
            return false;
        } else {
            possibleMoves.push([x, y]);
        }
        return true;
    }

    moveOnHtml() {
        const fromIndex = convertDbToHtml(this.position);
        const toIndex = convertDbToHtml(this.pendingPosition);

        clearElementImg(boardSquares[fromIndex]);

        addImgToElement(this, boardSquares[toIndex]);
    }

    confirmMove() {
        const [cx, cy] = this.position;
        const [px, py] = this.pendingPosition;

        // TO DO:
        // This is where we make the api call to validate the move

        game.board[cx][cy] = ".";
        game.board[px][py] = this;

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
        const possibleMoves = [];
        const ownPieces = [];
        const x = this.position[0];
        const y = this.position[1];
        for (let i = 1; i <= 2; i++) {
            if (board[x + i * this.direction][y] !== ".") {
                break;
            } else {
                possibleMoves.push([x + i * this.direction, y]);
            }
        }

        const possibleTakes = [
            [x + 1 * this.direction, y + 1],
            [x + 1 * this.direction, y - 1],
        ];
        const possibleTargets = [];
        possibleTakes.forEach((coor) => {
            let x = coor[0];
            let y = coor[1];
            if (!this.squareOnBoard(x, y, board)) {
                return;
            }
            const square = board[x][y];

            if (square !== ".") {
                if (square[1] !== this.colour) {
                    possibleTargets.push([x, y]);
                } else {
                    ownPieces.push([x, y]);
                }
            }
        });
        return { possibleMoves, possibleTargets, ownPieces };
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
        const ownPieces = [];
        const possibleMoves = [];
        const possibleTargets = [];
        this.directions.forEach((d) => {
            let x = this.position[0] + d[0];
            let y = this.position[1] + d[1];

            if (!this.squareOnBoard(x, y, board)) {
                return;
            }
            const square = board[x][y];
            this.checkSquareNeedsAdding(
                x,
                y,
                square,
                possibleMoves,
                possibleTargets,
                ownPieces
            );
        });
        return { possibleMoves, possibleTargets, ownPieces };
    }
}

class AgilePiece extends Piece {
    constructor(colour, position) {
        super(colour, position);
    }

    availableMoves(board) {
        const ownPieces = [];
        const possibleMoves = [];
        const possibleTargets = [];
        this.directions.forEach((d) => {
            let x = this.position[0] + d[0];
            let y = this.position[1] + d[1];
            while (0 <= x && x < board.length && 0 <= y && y < board.length) {
                let square = board[x][y];
                if (
                    !this.checkSquareNeedsAdding(
                        x,
                        y,
                        square,
                        possibleMoves,
                        possibleTargets,
                        ownPieces
                    )
                ) {
                    break;
                }
                x += d[0];
                y += d[1];
            }
        });
        return { possibleMoves, possibleTargets, ownPieces };
    }
}

class Knight extends Piece {
    constructor(colour, position) {
        super(colour, position);
        this.imageUrl = "./images/knight.png";
        this.possibleMoves = [
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
        const ownPieces = [];
        const possibleMoves = [];
        const possibleTargets = [];
        this.possibleMoves.forEach((d) => {
            const x = this.position[0] + d[0];
            const y = this.position[1] + d[1];

            if (!this.squareOnBoard(x, y, board)) {
                return;
            }
            const square = board[x][y];

            this.checkSquareNeedsAdding(
                x,
                y,
                square,
                possibleMoves,
                possibleTargets,
                ownPieces
            );
        });
        return { possibleMoves, possibleTargets, ownPieces };
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
