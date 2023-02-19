// const boardSquares = document.getElementsByClassName("cell");
const confirmContainer = document.getElementById("confirm-container");
const confirmBox = document.getElementById("confirm-box");
const cancelBox = document.getElementById("cancel-box");

class UI {
    constructor(game) {
        this.boardElement = document.getElementById("board");
        this.squares = document.getElementsByClassName("cell");
        this.game = game;
    }

    initialize() {
        this.boardElement.addEventListener("click", (e) => {
            const element = this.findTargetFromEvent(e.target);
            const row = parseInt(element.dataset.row);
            const col = parseInt(element.dataset.col);

            this.game.handleClick(row, col);
        });
    }

    selectPiece() {
        const piece = this.game.selectedPiece;
        this.highlightPiece(piece);

        for (let [row, col] of piece.possibleMoves) {
            const index = convertDbToHtml([row, col]);
            const target = this.squares[index].querySelector(".target");
            target.style.display = "inline";
        }

        for (let [row, col] of piece.possibleTakes) {
            const index = convertDbToHtml([row, col]);
            const target = this.squares[index].querySelector(".target");
            target.style.backgroundColor = "red";
            target.style.display = "inline";
        }
    }

    restartMove() {
        for (let i = 0; i < this.squares.length; i++) {
            const target = this.squares[i].querySelector(".target");
            target.style.backgroundColor = "rgba(137, 137, 137, 0.3)";
            target.style.display = "none";
        }
    }

    highlightPiece(piece) {
        const index = convertDbToHtml(piece.position);
        this.squares[index].style.opacity = 0.8;
    }

    movePiece(from, to) {
        this.restartMove();

        const fromIndex = convertDbToHtml(from);
        const toIndex = convertDbToHtml(to);
        this.clearElementImg(fromIndex);
        this.addImgToElement(this.game.selectedPiece, toIndex);
    }

    takePiece(from, to) {
        this.restartMove();

        const fromIndex = convertDbToHtml(from);
        const toIndex = convertDbToHtml(to);
        this.clearElementImg(fromIndex);
        this.clearElementImg(toIndex);
        this.addImgToElement(this.game.selectedPiece, toIndex);
    }

    clearEventListener(element) {
        const newCell = element.cloneNode(true);
        element.parentNode.replaceChild(newCell, element);
    }

    clearElementImg(index) {
        const element = this.squares[index];
        // remove any current images
        const pieceImage = element.querySelector("img");
        if (pieceImage) {
            pieceImage.remove();
        }
    }

    clearAllEventListeners() {
        for (let i = 0; i < boardSquares.length; i++) {
            clearEventListener(boardSquares[i]);
        }
    }

    setBoard() {
        for (let row = 0; row < this.game.board.state.length; row++) {
            for (let col = 0; col < this.game.board.state[0].length; col++) {
                const piece = this.game.board.state[row][col];

                const i = convertDbToHtml([row, col]);
                this.squares[i].querySelector("div.target").style.display =
                    "none";
                this.clearElementImg(i);

                if (piece) {
                    this.addImgToElement(piece, i);
                }
            }
        }
    }

    addImgToElement(piece, i) {
        const element = this.squares[i];
        const img = document.createElement("img");

        img.src = piece.url;
        img.className = piece.constructor.name;

        element.appendChild(img);
    }

    findTargetFromEvent(e) {
        if (e.className && e.className.includes("cell")) {
            return e;
        }

        return this.findTargetFromEvent(e.parentNode);
    }

    clearAllTargets() {
        for (let i = 0; i < boardSquares.length; i++) {
            getTargetElementFromIndex(i).style.display = "none";
        }
    }

    getTargetElementFromIndex(i) {
        return boardSquares[i].querySelector(".target");
    }

    clearPieceSelection(e) {
        game.selectedPiece = [];
        game.restartEventListenersPieces();
    }

    displayWinPopup(winner, winMethod) {
        const popup = document.getElementById("pop-up");
        const winnerText = document.getElementById("player-colour");
        const winMethodText = document.getElementById("win-method");

        const colour = winner.colour === "w" ? "White" : "Black";
        winnerText.textContent = colour;

        winMethodText.textContent = winMethod;

        popup.style.visibility = "visible";
    }
}
