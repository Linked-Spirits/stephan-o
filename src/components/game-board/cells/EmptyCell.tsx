import { ReactNode } from "react";
import { Cell, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import { updateFilling } from "./utils";
import { Neighbors } from "../matrix/Matrix.types";
import { GameState } from "@/components/game-state/GameState";

export class EmptyCell extends Cell {
    constructor() {
        super(CellType.Empty, "Case vide");
    }

    override clone(): EmptyCell {
        const clonedCell = this.cloneProperties(new EmptyCell());

        return clonedCell;
    }

    override update(neighbors: Neighbors<Cell>, gameState: GameState): void {
        updateFilling(this, neighbors, gameState.currentCycle)
    }

    override render({key}: {key: string}): ReactNode {
        return (
            <CellRenderer
                key={key}
                cell={this}
                customClasses="empty"
            />
        )
    }
};
