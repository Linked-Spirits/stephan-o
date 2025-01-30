/* import { Neighbors<Cell>, GameState } from "../GameBoard.utils";
import { Cell, CellParameters } from "./Cell";
import { CellType } from "./cellTypes";

interface ExitParameters extends CellParameters {
    isTrap: boolean
}

export class ExitCell extends Cell<ExitParameters> {
    constructor(cellType: string) {
        const isTrap = cellType === "!"

        super(
            CellType.Exit,
            `Sortie${isTrap ? " piège" : ""}`,
            { isTrap }
        );
    }

    override update(neighbors: Neighbors<Cell>, gameState: GameState): void {
        if (!this.parameters.isTrap) {
            this.setFilling(0)
        }
    }
};
 */