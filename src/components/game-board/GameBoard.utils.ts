import { Cell } from "./cells/Cell";
import { DoorCell } from "./cells/DoorCell";
import { EmptyCell } from "./cells/EmptyCell";
import { FullCell } from "./cells/FullCell";
import { SourceCell } from "./cells/SourceCell";

export const buildCell = (cellType: string): Cell => {
    const cellCategory = cellType[0] ?? "";

    const builders: Record<string, () => Cell> = {
        "=": () => new EmptyCell(),
        "+": () => new SourceCell(),
        // "#": () => new ExitCell(cellType),
        // "!": () => new ExitCell(cellType),
        "D": () => new DoorCell(cellType),
        // "O": () => new DoorCell(cellType),
        // "S": () => new SensorCell(cellType),
        // "P": () => new PipeCell(cellType),
        "": () => new FullCell()
    };

    return builders[cellCategory]()
};
