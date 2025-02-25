import { Cell } from "./cells/Cell";
import { DoorCell } from "./cells/DoorCell";
import { EmptyCell } from "./cells/EmptyCell";
import { FullCell } from "./cells/FullCell";
import { SourceCell } from "./cells/SourceCell";

export const buildCell = (cellType: string, coords: [number, number]): Cell => {
    const cellCategory = cellType[0] ?? "";

    const builders: Record<string, () => Cell> = {
        "=": () => new EmptyCell(coords),
        "+": () => new SourceCell(coords),
        // "#": () => new ExitCell(cellType),
        // "!": () => new ExitCell(cellType),
        "D": () => new DoorCell(coords, cellType),
        // "O": () => new DoorCell(cellType),
        // "S": () => new SensorCell(cellType),
        // "P": () => new PipeCell(cellType),
        "": () => new FullCell(coords)
    };

    return builders[cellCategory]()
};
