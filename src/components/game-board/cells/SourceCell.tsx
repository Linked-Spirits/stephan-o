import Image from "next/image";
import { Cell, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import { GameState } from "@/components/game-state/GameState";
import { Matrix } from "../matrix/Matrix";

export class SourceCell extends Cell {
    constructor(coords: [number, number]) {
        super(
            coords,
            CellType.Source,
            "Source d'eau",
        )

        this.setFilling(100);
        this.setFlowSpeed(20);
    }

    override clone(): SourceCell {
        const clonedCell = this.cloneProperties(new SourceCell(this.coords));

        return clonedCell;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override update(matrix: Matrix<Cell>, gameState: GameState): void {}

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
