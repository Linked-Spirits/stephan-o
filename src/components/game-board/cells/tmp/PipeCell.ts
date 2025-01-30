/* import { Neighbors<Cell>, GameState } from "../GameBoard.utils";
import { Cell, CellParameters } from "./Cell";
import { CellType } from "./cellTypes";

interface PipeParameters extends CellParameters {
    outputs: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    }
}

export class PipeCell extends Cell<PipeParameters> {
    constructor(cellType: string) {
        const outputsTypes = cellType.split("-")[1]
        const outputs = {
            top: outputsTypes.includes("T"),
            right: outputsTypes.includes("R"),
            bottom: outputsTypes.includes("B"),
            left: outputsTypes.includes("L"),
        }

        const buildLabel = () => {
            const arrows = [
                outputs.top ? " ↑" : "",
                outputs.right ? " →" : "",
                outputs.bottom ? " ↓" : "",
                outputs.left ? " ←" : "",
            ].filter(Boolean);
    
            return `Tuyau${arrows.length ? arrows.join() : ""}`;
        };

        super(
            CellType.Sensor,
            buildLabel(),
            { outputs }
        );
    }

    override update(neighbors: Neighbors<Cell>, gameState: GameState): void {}
};
 */