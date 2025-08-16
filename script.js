document.addEventListener("DOMContentLoaded", () => {
    const solveOption = document.getElementById("solve-option");
    const generateOption = document.getElementById("generate-option");
    const solveSection = document.getElementById("solve-section");
    const generateSection = document.getElementById("generate-section");
    const solveGrid = document.getElementById("solve-grid");
    const generatedGrid = document.getElementById("generated-grid");
    const solveButton = document.getElementById("solve-button");
    const difficultyButtons = document.querySelectorAll(".difficulty button");
    const gridSize = 9;
    function createGrid(container) {
    container.innerHTML = "";
    for (let i = 0; i < gridSize * gridSize; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    input.max = 9;
    input.value = "";
    container.appendChild(input);
    }
    }
    function getGridValues(container) {
    const values = [];
    Array.from(container.children).forEach((cell, index) => {
    const value = parseInt(cell.value) || 0;
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    if (!values[row]) values[row] = [];
    values[row][col] = value;
    });
    return values;
    }
    function setGridValues(container, grid) {
    Array.from(container.children).forEach((cell, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    cell.value = grid[row][col] || "";
    if (grid[row][col] !== 0) cell.disabled = true;
    });
    }
    function isSafe(grid, row, col, num) {
    for (let x = 0; x < gridSize; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const startRow = row - (row % 3), startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
    if (grid[startRow + i][startCol + j] === num) return false;
    }
    }
    return true;
    }
    function solveSudoku(grid) {
    for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
    if (grid[row][col] === 0) {
    for (let num = 1; num <= gridSize; num++) {
    if (isSafe(grid, row, col, num)) {
    grid[row][col] = num;
    if (solveSudoku(grid)) return true;
    grid[row][col] = 0;
    }
    }
    return false;
    }
    }
    }
    return true;
    }
    function generateFullSudoku() {
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    const fillGrid = () => {
    for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
    if (grid[row][col] === 0) {
    const numbers = Array.from({ length: gridSize }, (_, i) => i + 1).sort(() =>
    Math.random() - 0.5);
    for (const num of numbers) {
    if (isSafe(grid, row, col, num)) {
    grid[row][col] = num;
    if (fillGrid()) return true;
    grid[row][col] = 0;
    }
    }
    return false;
    }
    }
    }
    return true;
    };
    fillGrid();
    return grid;
    }
    function removeCells(grid, percentage) {
    const cellsToRemove = Math.floor(gridSize * gridSize * percentage);
    let removed = 0;
    while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    if (grid[row][col] !== 0) {
    grid[row][col] = 0;
    removed++;
    }
    }
    }
    solveOption.addEventListener("click", () => {
    generateSection.classList.add("hidden");
    solveSection.classList.remove("hidden");
    createGrid(solveGrid);
    });
    generateOption.addEventListener("click", () => {
    solveSection.classList.add("hidden");
    generateSection.classList.remove("hidden");
    createGrid(generatedGrid);
    });
    solveButton.addEventListener("click", () => {
    const grid = getGridValues(solveGrid);
    if (solveSudoku(grid)) {
    setGridValues(solveGrid, grid);
    } else {
    alert("No solution exists for the given Sudoku!");
    }
    });
    difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
    const level = button.dataset.level;
    const difficultyMap = {
    easy: 0.4,
    medium: 0.5,
    hard: 0.6,
    };
    const sudokuGrid = generateFullSudoku();
    removeCells(sudokuGrid, difficultyMap[level]);
    setGridValues(generatedGrid, sudokuGrid);
    });
    });
    });