import { ReactNode } from "react";
import { Cell, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import { GameState } from "@/components/game-state/GameState";
import { Matrix } from "../matrix/Matrix";

export class FullCell extends Cell {
    constructor(coords: [number, number]) {
        super(
            coords,
            CellType.Full,
            "Case pleine",
            {},
            true
        );
    }

    override clone(): FullCell {
        const clonedCell = this.cloneProperties(new FullCell(this.coords));

        return clonedCell;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override update(matrix: Matrix<Cell>, gameState: GameState): void {}

    override render({key}: {key: string}): ReactNode {
        return (
            <CellRenderer
                key={key}
                cell={this}
                customClasses="full"
            />
        )
    }
};
