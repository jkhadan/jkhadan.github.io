
export class SpatialGrid {
    private cellSize: number;
    private cols: number;
    private rows: number;
    private grid: number[][][]; // 3D array: col -> row -> indices of fish

    constructor(width: number, height: number, cellSize: number) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.grid = [];
        this.initGrid();
    }

    resize(width: number, height: number) {
        this.cols = Math.ceil(width / this.cellSize);
        this.rows = Math.ceil(height / this.cellSize);
        this.initGrid();
    }

    private initGrid() {
        this.grid = new Array(this.cols);
        for (let x = 0; x < this.cols; x++) {
            this.grid[x] = new Array(this.rows);
            for (let y = 0; y < this.rows; y++) {
                this.grid[x][y] = [];
            }
        }
    }

    clear() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.grid[x][y].length = 0;
            }
        }
    }

    add(fishIndex: number, x: number, y: number) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            this.grid[col][row].push(fishIndex);
        }
    }

    getNeighbors(x: number, y: number, radius: number): number[] {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        const radCells = Math.ceil(radius / this.cellSize);

        const neighbors: number[] = [];

        const minCol = Math.max(0, col - radCells);
        const maxCol = Math.min(this.cols - 1, col + radCells);
        const minRow = Math.max(0, row - radCells);
        const maxRow = Math.min(this.rows - 1, row + radCells);

        for (let c = minCol; c <= maxCol; c++) {
            for (let r = minRow; r <= maxRow; r++) {
                const cell = this.grid[c][r];
                for (let i = 0; i < cell.length; i++) {
                    neighbors.push(cell[i]);
                }
            }
        }

        return neighbors;
    }
}
