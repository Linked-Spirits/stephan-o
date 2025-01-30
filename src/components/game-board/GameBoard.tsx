import { Level } from "../levels/levels";
import { Matrix, MatrixData } from "./matrix/Matrix";
import { Cell } from "./cells/Cell";
import { FullCell } from "./cells/FullCell";
import { buildCell } from "./GameBoard.utils";

import "./gameBoard.css"
import { GameState } from "../game-state/GameState";

export class GameBoard {
    private matrix: Matrix<Cell>;
    private gameState: GameState;

    constructor(level?: Level) {
        const builtMatrix = this.buildMatrix(level?.matrix ?? [])

        this.matrix = new Matrix(builtMatrix);
        this.gameState = new GameState();
    }

    private buildMatrix(matrix: Level["matrix"]): MatrixData<Cell> {
        const rows = matrix?.length ?? 0;
        const cols = matrix?.[0]?.length ?? 0;
        const newMatrix: MatrixData<Cell> = [];

        for (let i = 0; i < rows; i++) {
            newMatrix.push(new Array(cols).fill(null));
        }

        for (let i = 0; i <= rows - 1; i++) {
            for (let j = 0; j <= cols - 1; j++) {
                newMatrix[i][j] = buildCell(matrix[i][j])
            }
        }

        return newMatrix
    }

    getMatrix(): Matrix<Cell> {
        return this.matrix;
    }

    update(): GameBoard {
        this.gameState.newCycle();

        // console.log(this.matrix)

        const { rows, cols } = this.matrix;

        const newMatrix = new Matrix<Cell>(
            Array.from({ length: rows }, () => new Array<Cell>(cols))
        );

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const currentCell = this.matrix.get(i, j);

                if (currentCell) {
                    // On récupère les voisins de la cellule
                    const neighbors = this.matrix.getNeighbors(i, j);

                    // On clone cette cellule pour que son prochain état
                    // n'affecte pas les autres
                    const clonedCell = currentCell.clone();

                    // On met la à jour la cellule clonée grâce
                    // à ses voisins et l'état global
                    clonedCell.update(neighbors, this.gameState);

                    // On l'ajoute à la nouvelle matrice
                    newMatrix.set(i, j, clonedCell);
                } else {
                    newMatrix.set(i, j, new FullCell());
                }
            }
        }

        this.matrix = newMatrix;

        return this;
    }

    // todo: refresh, réaffiche les mêmes cellules (mais certaines peuvent avoir changé avec le clic cd. CellDoor)

    render() {
        return (
            <div className="gameBoard">
                {Array.from({ length: this.matrix.rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {Array.from({ length: this.matrix.cols }).map((_, colIndex) => (
                            this.matrix
                                .get(rowIndex, colIndex)
                                .render({key: `${rowIndex}-${colIndex}`})
                        ))}
                    </div>
                ))}
            </div>
        )
    }
}
