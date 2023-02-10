class Piece {
    constructor(colour) {
        this.colour = colour;
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
}

class Pawn extends Piece {
    constructor(colour) {
        super(colour);
        this.direction = this.findDirection();
    }

    findDirection() {
        if (this.colour === "w") {
            return 1;
        } else {
            return -1;
        }
    }

    availableMoves(currentPosition, board) {
        const possibleMoves = [];
        const ownPieces = [];
        const x = currentPosition[0];
        const y = currentPosition[1];
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
    constructor(colour) {
        super(colour);
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

    availableMoves(currentPosition, board) {
        const ownPieces = [];
        const possibleMoves = [];
        const possibleTargets = [];
        this.directions.forEach((d) => {
            let x = currentPosition[0] + d[0];
            let y = currentPosition[1] + d[1];

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
    constructor(colour) {
        super(colour);
    }

    availableMoves(currentPosition, board) {
        const ownPieces = [];
        const possibleMoves = [];
        const possibleTargets = [];
        this.directions.forEach((d) => {
            let x = currentPosition[0] + d[0];
            let y = currentPosition[1] + d[1];
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
    constructor(colour) {
        super(colour);
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

    availableMoves(currentPosition, board) {
        const ownPieces = [];
        const possibleMoves = [];
        const possibleTargets = [];
        this.possibleMoves.forEach((d) => {
            const x = currentPosition[0] + d[0];
            const y = currentPosition[1] + d[1];

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
    constructor(colour) {
        super(colour);
        this.directions = [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ];
    }
}

class Rook extends AgilePiece {
    constructor(colour) {
        super(colour);
        this.directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ];
    }
}

class Queen extends AgilePiece {
    constructor(colour) {
        super(colour);
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
