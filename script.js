const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cells = [...document.querySelectorAll(".cell")];
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const scoreEls = {
  X: document.getElementById("score-x"),
  O: document.getElementById("score-o"),
  draw: document.getElementById("score-draw"),
};
let board = Array(9).fill("");
let current = "X";
let over = false;
const scores = { X: 0, O: 0, draw: 0 };
function winner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line };
    }
  }
  return null;
}
function render() {
  cells.forEach((cell, i) => {
    const mark = board[i];
    cell.textContent = mark;
    cell.classList.toggle("x", mark === "X");
    cell.classList.toggle("o", mark === "O");
    cell.disabled = over || Boolean(mark);
    cell.setAttribute("aria-label", mark ? `Cell ${i + 1}, ${mark}` : `Cell ${i + 1}, empty`);
  });
}
function finish(message, line = []) {
  over = true;
  statusEl.textContent = message;
  cells.forEach((cell, i) => {
    cell.disabled = true;
    cell.classList.toggle("win", line.includes(i));
  });
}
function play(index) {
  if (over || board[index]) return;
  board[index] = current;
  render();
  const result = winner();
  if (result) {
    scores[result.player] += 1;
    scoreEls[result.player].textContent = scores[result.player];
    finish(`${result.player} wins!`, result.line);
    return;
  }
  if (board.every(Boolean)) {
    scores.draw += 1;
    scoreEls.draw.textContent = scores.draw;
    finish("It’s a draw.");
    return;
  }
  current = current === "X" ? "O" : "X";
  statusEl.textContent = `${current}’s turn`;
}
function reset() {
  board = Array(9).fill("");
  current = "X";
  over = false;
  cells.forEach((cell) => cell.classList.remove("win"));
  statusEl.textContent = "X’s turn";
  render();
}
cells.forEach((cell) => {
  cell.addEventListener("click", () => play(Number(cell.dataset.index)));
});
resetBtn.addEventListener("click", reset);
render();
