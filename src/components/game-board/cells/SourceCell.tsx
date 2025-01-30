import Image from "next/image";
import { Cell, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import { Neighbors } from "../matrix/Matrix.types";
import { GameState } from "@/components/game-state/GameState";

export class SourceCell extends Cell {
    constructor() {
        super(
            CellType.Source,
            "Source d'eau",
        )

        this.setFilling(100);
        this.setFlowSpeed(20);
    }

    override clone(): SourceCell {
        const clonedCell = this.cloneProperties(new SourceCell());

        return clonedCell;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override update(neighbors: Neighbors<Cell>, gameState: GameState): void {}

    override render({key}: {key: string}) {
        return (
            <CellRenderer
                key={key}
                cell={this}
                customClasses="source"
            >
                <Image
                    src="/source.svg"
                    alt={this.label}
                    height={0}
                    width={0}
                />
            </CellRenderer>
        )
    }
};
