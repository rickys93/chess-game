const convertDbToHtml = ([x, y]) => x * 8 + y;

function convertHtmlToDb(coor) {
    const y = coor % 8;
    coor -= y;
    const x = coor / 8;
    return [x, y];
}

function arrayInSet(innerArr, set) {
    for (array of set) {
        if (JSON.stringify(innerArr) === JSON.stringify(array)) {
            return true;
        }
    }
    return false;
}

function getCoordinatesFromElement(target) {
    const x = parseInt(target.id[0]);
    const y = parseInt(target.id[1]);
    return [x, y];
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

function findTargetFromEvent(e) {
    if (e.className && e.className.includes("cell")) {
        return e;
    }

    return this.findTargetFromEvent(e.parentNode);
}
