const board = [
    ["Rw", "Nw", "Bw", ".", "Kw", "Bw", "Nw", "Rw"],
    ["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", "Nw", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["Pb", "Pb", "Pb", "Pb", "Pb", "Qw", "Pb", "Pb"],
    ["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"],
];

const game = new Game(board);
game.newGame();
