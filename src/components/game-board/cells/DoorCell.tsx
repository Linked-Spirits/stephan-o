import { ReactNode } from "react";
import { Cell, CellParameters, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import Image from "next/image";
import { updateFilling } from "./utils";
import { GameState } from "@/components/game-state/GameState";
import { Matrix } from "../matrix/Matrix";

interface DoorParameters extends CellParameters {
    isClosed: boolean;
    sensorId: number | null;
}

export class DoorCell extends Cell<DoorParameters> {
    constructor(coords: [number, number], cellType?: string) {
        const isClosed = cellType?.startsWith("D") || false;
        const sensorId = parseInt(cellType?.split("-")[1] ?? "", 10);

        const sensorIdStr = isNaN(sensorId) ? "" : ` (${sensorId})`;

        super(
            coords,
            CellType.Door,
            `Porte${sensorIdStr}`,
            {
                isClosed,
                sensorId: isNaN(sensorId) ? null : sensorId,
            }
        );
    }

    override clone(): DoorCell {
        const clonedCell = this.cloneProperties(new DoorCell(this.coords, this.type));

        return clonedCell;
    }

    override update(matrix: Matrix<Cell>, gameState: GameState): void {
        if (this.isOpen) {
            updateFilling(this, matrix, gameState.currentCycle)
        }
    };

    override render({key}: {key: string}): ReactNode {
        const { isClosed } = this.parameters;
        const imgSrc = isClosed ? "/closed-door.svg" : "/open-door.svg";
    
        return (
            <CellRenderer
                key={key}
                cell={this}
                customClasses={`door${!isClosed ? " door--isOpen" : ""}`}
                onClick={() => this.toggle() }
            >
                <Image
                    src={imgSrc}
                    alt={this.label}
                    height={100}
                    width={100}
                />
            </CellRenderer>
        )
    }

    get isClosed() {
        return this.parameters.isClosed;
    }

    get isOpen() {
        return !this.parameters.isClosed;
    }

    toggle() {
        this.parameters.isClosed = !this.parameters.isClosed;
        
        if (this.isClosed) {
            this.reset();
        }
    }
};
