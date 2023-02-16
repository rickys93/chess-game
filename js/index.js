const { Pawn, Rook, Bishop, Knight, Queen, King } = require("./pieces");

const board = [
    ["Rw", "Nw", "Bw", ".", "Kw", "Bw", "Nw", "Rw"],
    ["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "Qw", "."],
    ["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"],
    ["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"],
];

const boardSquares = document.getElementsByClassName("cell");
const confirmContainer = document.getElementById("confirm-container");
const confirmBox = document.getElementById("confirm-box");
const cancelBox = document.getElementById("cancel-box");

class Player {
    constructor(colour) {
        this.colour = colour;
    }
}

function createBoardPieces(board) {
    const boardObjects = [];
    for (let x = 0; x < board.length; x++) {
        const newRow = [];
        for (let y = 0; y < board[0].length; y++) {
            if (board[x][y] === ".") {
                newRow.push(".");
            } else {
                const piece = getPieceObjectFromCoordinates(board, x, y);
                newRow.push(piece);
            }
        }
        boardObjects.push(newRow);
    }
    return boardObjects;
}

class Game {
    constructor() {
        this.currentPlayer = new Player("w");
        this.otherPlayer = new Player("b");
        this.selectedPiece = null;
        this.targettedPiece = null;
    }

    newGame() {
        this.initializeGame();
    }

    initializeGame() {
        this.board = createBoardPieces(board);
        this.restartEventListenersPieces();
        for (let i = 0; i < boardSquares.length; i++) {
            let [x, y] = convertHtmlToDb(i);

            const piece = this.board[x][y];

            if (piece.constructor.name === "King") {
                if (this.currentPlayer.colour === piece.colour) {
                    this.currentPlayer.king = piece;
                } else {
                    this.otherPlayer.king = piece;
                }
            }
        }
    }

    startPlayerTurn() {
        const check = this.checkForCheck(this.board);
        this.currentPlayer.check = check;

        this.restartEventListenersPieces();
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
        displayWinPopup(winner, winMethod);
    }

    restartEventListenersPieces() {
        this.selectedPiece = null;
        this.targettedPiece = null;
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[0].length; y++) {
                const piece = this.board[x][y];

                const i = convertDbToHtml([x, y]);

                boardSquares[i].querySelector("div.target").style.display =
                    "none";
                clearEventListener(boardSquares[i]);
                clearElementImg(boardSquares[i]);

                if (piece !== ".") {
                    if (piece.colour === this.currentPlayer.colour) {
                        boardSquares[i].addEventListener("click", selectPiece);
                    }

                    // add image to square
                    addImgToElement(piece, boardSquares[i]);
                }
            }
        }
    }

    checkForCheck(board) {
        let totalPossibleMoves = [];
        let totalPossibleTargets = [];
        let totalOwnPieces = [];
        let check = false;
        let checkMate = false;
        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[0].length; y++) {
                const piece = board[x][y];

                // checking if there is a piece on the square
                if (piece !== ".") {
                    // making sure it's the other player's piece
                    if (piece.colour === this.currentPlayer.colour) {
                        continue;
                    }

                    // going to add up all the other player's possible moves into one array
                    const { possibleMoves, possibleTargets, ownPieces } =
                        piece.availableMoves(board);

                    totalPossibleMoves =
                        totalPossibleMoves.concat(possibleMoves);
                    totalPossibleTargets =
                        totalPossibleTargets.concat(possibleTargets);
                    totalOwnPieces = totalOwnPieces.concat(ownPieces);
                }
            }
        }
        // now we can check if the king is in check
        if (
            arrayInArray(this.currentPlayer.king.position, totalPossibleTargets)
        ) {
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
        const { possibleMoves, possibleTargets } =
            this.currentPlayer.king.availableMoves(board);
        const totalKingMoves = possibleMoves.concat(possibleTargets);
        const totalOpponentMoves = totalPossibleMoves.concat(
            totalPossibleTargets,
            totalOwnPieces
        );

        checkMate = true;
        totalKingMoves.forEach((m) => {
            if (!arrayInArray(m, totalOpponentMoves)) {
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

function convertDbToHtml([x, y]) {
    return x * 8 + y;
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

function clearElementImg(element) {
    // remove any current images
    const pieceImage = element.querySelector("img");
    if (pieceImage) {
        pieceImage.remove();
    }
}

function clearAllEventListeners() {
    for (let i = 0; i < boardSquares.length; i++) {
        clearEventListener(boardSquares[i]);
    }
}

function getPieceObjectFromCoordinates(board, x, y) {
    const pieceString = board[x][y][0];
    const pieceColour = board[x][y][1];

    const piece = new pieceObjects[pieceString](pieceColour, [x, y]);
    return piece;
}

function addImgToElement(piece, element) {
    const img = document.createElement("img");

    img.src = piece.url;
    img.className = piece.constructor.name;

    element.appendChild(img);
}

function getCoordinatesFromElement(target) {
    const x = parseInt(target.id[0]);
    const y = parseInt(target.id[1]);
    return [x, y];
}

function findTargetFromEvent(e) {
    let target;
    if (e.target.tagName === "IMG" || e.target.className === "target") {
        target = e.target.parentNode;
    } else {
        target = e.target;
    }
    return target;
}

function selectPiece(e) {
    clearAllEventListeners();

    target = findTargetFromEvent(e);
    [x, y] = getCoordinatesFromElement(target);

    game.selectedPiece = game.board[x][y];

    const { possibleMoves, possibleTargets } =
        game.selectedPiece.availableMoves(game.board);

    const index = convertDbToHtml([x, y]);
    boardSquares[index].addEventListener("click", clearPieceSelection);

    possibleMoves.forEach((sq) => {
        const index = convertDbToHtml([sq[0], sq[1]]);

        boardSquares[index].querySelector(".target").style.display = "inline";

        boardSquares[index].addEventListener("click", movePiece);
    });

    possibleTargets.forEach((sq) => {
        const index = convertDbToHtml([sq[0], sq[1]]);

        boardSquares[index].querySelector(".target").style.backgroundColor =
            "red";
        boardSquares[index].querySelector(".target").style.display = "inline";

        boardSquares[index].addEventListener("click", takePiece);
    });
}

function clearAllTargets() {
    for (let i = 0; i < boardSquares.length; i++) {
        getTargetElementFromIndex(i).style.display = "none";
    }
}

function getTargetElementFromIndex(i) {
    return boardSquares[i].querySelector(".target");
}

function clearPieceSelection(e) {
    game.selectedPiece = [];
    game.restartEventListenersPieces();
}

function movePiece(e) {
    clearAllEventListeners();
    clearAllTargets();

    const target = findTargetFromEvent(e);
    const [x, y] = getCoordinatesFromElement(target);

    if (moveLeadsToCheck(game, [x, y])) {
        game.restartEventListenersPieces();
        return;
    }

    game.selectedPiece.pendingPosition = [x, y];

    // move piece in html and then clear all event listeners while we wait to confirm
    // if not confirmed, reset the round from the game.board
    game.selectedPiece.moveOnHtml();

    confirmContainer.style.visibility = "visible";
}

function takePiece(e) {
    clearAllEventListeners();
    clearAllTargets();

    const target = findTargetFromEvent(e);
    const [x, y] = getCoordinatesFromElement(target);

    if (moveLeadsToCheck(game, [x, y])) {
        return;
    }

    game.selectedPiece.pendingPosition = [x, y];

    game.targettedPiece = game.board[x][y];

    // move piece in html and then clear all event listeners while we wait to confirm
    // if not confirmed, reset the round from the game.board
    game.selectedPiece.takeOnHtml();

    confirmContainer.style.visibility = "visible";
}

confirmBox.addEventListener("click", confirmMove);
cancelBox.addEventListener("click", cancelMove);

function confirmMove() {
    game.selectedPiece.confirmMove();
    confirmContainer.style.visibility = "hidden";
}

function cancelMove() {
    game.restartEventListenersPieces();
    confirmContainer.style.visibility = "hidden";
}

function deepCopy(board) {
    let copy = [];
    for (row of board) {
        const newRow = [];
        for (square of row) {
            newRow.push(square);
        }
        copy.push(newRow);
    }
    return copy;
}

function moveLeadsToCheck(game, pendingPosition) {
    let pendingBoard = deepCopy(game.board);
    pendingBoard = moveOnBoard(
        pendingBoard,
        game.selectedPiece,
        pendingPosition
    );
    const check = game.checkForCheck(pendingBoard);
    return check ? true : false;
}

function displayWinPopup(winner, winMethod) {
    const popup = document.getElementById("pop-up");
    const winnerText = document.getElementById("player-colour");
    const winMethodText = document.getElementById("win-method");

    const colour = winner.colour === "w" ? "White" : "Black";
    winnerText.textContent = colour;

    winMethodText.textContent = winMethod;

    popup.style.visibility = "visible";
}

function moveOnBoard(currentBoard, piece, pendingPosition) {
    const [cx, cy] = piece.position;
    const [px, py] = pendingPosition;
    currentBoard[cx][cy] = ".";
    currentBoard[px][py] = piece;
    return currentBoard;
}
