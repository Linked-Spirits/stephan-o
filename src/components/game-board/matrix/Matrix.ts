import { Neighbors } from "./Matrix.types";

export type MatrixData<T> = T[][];

export class Matrix<T> {
    private data: MatrixData<T>;

    constructor(data: MatrixData<T>) {
        this.data = data;
    }

    get rows(): number {
        return this.data.length;
    }

    get cols(): number {
        return this.data[0]?.length ?? 0;
    }

    private ensureInBounds(row: number, col: number): void {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error("Index out of bounds");
        }
    }

    get(row: number, col: number): T {
        this.ensureInBounds(row, col);
        return this.data[row][col];
    }

    set(row: number, col: number, value: T): void {
        this.ensureInBounds(row, col);
        this.data[row][col] = value;
    }

    fill(value: T): void {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.set(i, j, value);
            }
        }
    }

    getNeighbors(row: number, col: number): Neighbors<T> {
        const getNeighbor = (neighborRow: number, neighborCol: number): T | null => {
            return neighborRow >= 0
                && neighborRow < this.rows
                && neighborCol >= 0
                && neighborCol < this.cols
                    ? this.get(neighborRow, neighborCol) as T
                    : null;
        };
    
        return {
            top: getNeighbor(row - 1, col),
            right: getNeighbor(row, col + 1),
            bottom: getNeighbor(row + 1, col),
            left: getNeighbor(row, col - 1),
            topRight: getNeighbor(row - 1, col + 1),
            topLeft: getNeighbor(row - 1, col - 1),
            bottomRight: getNeighbor(row + 1, col + 1),
            bottomLeft: getNeighbor(row + 1, col - 1),
        };
    }
}
