class Board {
    constructor(board) {
        this.state = this.createState(board);
        this.pendingState = deepCopy(this.state);
    }

    createState(board) {
        const boardObjects = [];
        for (let x = 0; x < board.length; x++) {
            const newRow = [];
            for (let y = 0; y < board[0].length; y++) {
                if (board[x][y] === ".") {
                    newRow.push(null);
                } else {
                    const piece = this.getPieceObjectFromCoordinates(
                        board,
                        x,
                        y
                    );
                    newRow.push(piece);
                }
            }
            boardObjects.push(newRow);
        }
        return boardObjects;
    }

    getPieceObjectFromCoordinates(board, x, y) {
        const pieceObjects = {
            P: Pawn,
            N: Knight,
            B: Bishop,
            Q: Queen,
            R: Rook,
            K: King,
        };

        const pieceString = board[x][y][0];
        const pieceColour = board[x][y][1];

        const piece = new pieceObjects[pieceString](pieceColour, [x, y]);
        return piece;
    }

    confirmMove(piece) {
        const [fromRow, fromCol] = piece.position;
        const [toRow, toCol] = piece.pendingMove;
        this.state[fromRow][fromCol] = null;
        this.state[toRow][toCol] = piece;
    }

    pendingMove(piece, [toRow, toCol]) {
        const [fromRow, fromCol] = piece.position;
        this.pendingState[fromRow][fromCol] = null;
        this.pendingState[toRow][toCol] = piece;
    }

    cancelPendingMove(piece) {
        const [toRow, toCol] = piece.position;
        const [fromRow, fromCol] = piece.pendingMove;
        this.pendingState[fromRow][fromCol] = null;
        this.pendingState[toRow][toCol] = piece;
    }
}
