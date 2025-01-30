import { ReactNode } from "react";
import { Cell, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import { Neighbors } from "../matrix/Matrix.types";
import { GameState } from "@/components/game-state/GameState";

export class FullCell extends Cell {
    constructor() {
        super(
            CellType.Full,
            "Case pleine",
            {},
            true
        );
    }

    override clone(): FullCell {
        const clonedCell = this.cloneProperties(new FullCell());

        return clonedCell;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override update(neighbors: Neighbors<Cell>, gameState: GameState): void {}

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
