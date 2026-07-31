const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
let board = [];
let score = 0;

function initGame() {
    board = [...Array(4)].map(() => Array(4).fill(0));
    score = 0;
    updateScore();
    addRandomTile();
    addRandomTile();
    drawBoard();
}

function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) emptyCells.push({r, c});
        }
    }
    if (emptyCells.length > 0) {
        let {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function drawBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            let val = board[r][c];
            if (val !== 0) {
                tile.dataset.val = val;
                tile.textContent = val;
            }
            boardElement.appendChild(tile);
        }
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function slideAndMerge(row) {
    let filtered = row.filter(val => val !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i+1]) {
            filtered[i] *= 2;
            score += filtered[i];
            filtered.splice(i + 1, 1);
        }
    }
    while (filtered.length < 4) filtered.push(0);
    return filtered;
}

function moveLeft() {
    let changed = false;
    for (let r = 0; r < 4; r++) {
        let newRow = slideAndMerge(board[r]);
        if (newRow.join(',') !== board[r].join(',')) changed = true;
        board[r] = newRow;
    }
    return changed;
}

function rotateRight() {
    let newBoard = [...Array(4)].map(() => Array(4).fill(0));
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            newBoard[c][3 - r] = board[r][c];
        }
    }
    board = newBoard;
}

function move(direction) {
    let changed = false;
    if (direction === 'ArrowLeft') {
        changed = moveLeft();
    } else if (direction === 'ArrowUp') {
        rotateRight(); rotateRight(); rotateRight();
        changed = moveLeft();
        rotateRight();
    } else if (direction === 'ArrowRight') {
        rotateRight(); rotateRight();
        changed = moveLeft();
        rotateRight(); rotateRight();
    } else if (direction === 'ArrowDown') {
        rotateRight();
        changed = moveLeft();
        rotateRight(); rotateRight(); rotateRight();
    }
    
    if (changed) {
        addRandomTile();
        drawBoard();
        updateScore();
        checkGameOver();
    }
}

function checkGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return;
            if (c < 3 && board[r][c] === board[r][c+1]) return;
            if (r < 3 && board[r][c] === board[r+1][c]) return;
        }
    }
    setTimeout(() => alert('Game Over! 📉 Punteggio finale: ' + score), 300);
}

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key);
    }
});

initGame();