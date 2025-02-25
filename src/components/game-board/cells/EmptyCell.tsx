import { ReactNode } from "react";
import { Cell, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import { updateFilling } from "./utils";
import { GameState } from "@/components/game-state/GameState";
import { Matrix } from "../matrix/Matrix";

export class EmptyCell extends Cell {
    constructor(coords: [number, number]) {
        super(coords, CellType.Empty, "Case vide");
    }

    override clone(): EmptyCell {
        const clonedCell = this.cloneProperties(new EmptyCell(this.coords));

        return clonedCell;
    }

    override update(matrix: Matrix<Cell>, gameState: GameState): void {
        updateFilling(this, matrix, gameState.currentCycle)
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
