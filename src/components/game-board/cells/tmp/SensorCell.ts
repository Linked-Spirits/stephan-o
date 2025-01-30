/* import { Neighbors<Cell>, GameState } from "../GameBoard.utils";
import { Cell, CellParameters } from "./Cell";
import { CellType } from "./cellTypes";

interface SensorParameters extends CellParameters {
    sensorId: number;
    isActive: boolean
}

export class SensorCell extends Cell<SensorParameters> {
    constructor(cellType: string) {
        const sensorId = parseInt(cellType.split("-")[1], 10)

        super(
            CellType.Sensor,
            `Capteur (${sensorId})`,
            {
                sensorId,
                isActive: false,
            }
        );
    }

    override update(neighbors: Neighbors<Cell>, gameState: GameState): void {}
};
 */