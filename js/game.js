function squareOnBoard(x, y, board) {
    return 0 <= x && x < board.length && 0 <= y && y < board.length;
}

function checkSquareNeedsAdding(x, y, square, freeSquares, targets) {
    if (square !== ".") {
        if (square[1] !== this.colour) {
            targets.push([x, y]);
        }
    } else {
        freeSquares.push([x, y]);
    }
}

class Game {
    constructor() {
        this.playersTurn = "w";
    }
}

class Board {
    constructor() {
        this.piecePositions = startingBoard;
    }
}

class Piece {
    constructor(colour) {
        this.colour = colour;
    }
}

class Pawn extends Piece {
    constructor(colour, direction) {
        super(colour);
        this.direction = direction;
    }

    availableMoves(currentPosition, board) {
        const freeSquares = [];
        const x = currentPosition[0];
        const y = currentPosition[1];
        for (let i = 1; i <= 2; i++) {
            if (board[x + i * this.direction][y] !== ".") {
                break;
            } else {
                freeSquares.push([x + i * this.direction, y]);
            }
        }

        const possibleTargets = [
            [x + 1 * this.direction, y + 1],
            [x + 1 * this.direction, y - 1],
        ];
        const targets = [];
        possibleTargets.forEach((coor) => {
            let x = coor[0];
            let y = coor[1];
            const square = board[x][y];

            checkSquareNeedsAdding(x, y, square, freeSquares, targets);
        });
        return { freeSquares, targets };
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
        const freeSquares = [];
        const targets = [];
        this.directions.forEach((d) => {
            let x = currentPosition[0] + d[0];
            let y = currentPosition[1] + d[1];

            if (!squareOnBoard(x, y, board)) {
                return;
            }
            const square = board[x][y];
            checkSquareNeedsAdding(x, y, square, freeSquares, targets);
        });
        return { freeSquares, targets };
    }
}

class AgilePiece extends Piece {
    constructor(colour) {
        super(colour);
    }

    availableMoves(currentPosition, board) {
        const freeSquares = [];
        const targets = [];
        this.directions.forEach((d) => {
            let x = currentPosition[0] + d[0];
            let y = currentPosition[1] + d[1];
            while (0 <= x && x < board.length && 0 <= y && y < board.length) {
                let square = board[x][y];
                checkSquareNeedsAdding(x, y, square, freeSquares, targets);
                x += d[0];
                y += d[1];
            }
        });
        return { freeSquares, targets };
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
        this.possibleMoves.forEach((d) => {
            const x = currentPosition[0] + d[0];
            const y = currentPosition[1] + d[1];

            if (!squareOnBoard(x, y, board)) {
                return;
            }
            const square = board[x][y];

            checkSquareNeedsAdding(x, y, square, freeSquares, targets);
        });
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

const pawn = new Pawn("b", -1);
const piece = new Queen("b");
const board = [
    ["Rw", "Nw", "Bw", "Qw", "Kw", "Bw", "Nw", "Rw"],
    ["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"],
    ["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"],
];

console.log(piece.availableMoves([2, 1], board));
