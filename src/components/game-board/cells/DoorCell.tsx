import { ReactNode } from "react";
import { Cell, CellParameters, CellType } from "./Cell";
import { CellRenderer } from "./CellRenderer";
import Image from "next/image";
import { updateFilling } from "./utils";
import { Neighbors } from "../matrix/Matrix.types";
import { GameState } from "@/components/game-state/GameState";

interface DoorParameters extends CellParameters {
    isOpen: boolean;
    sensorId: number | null;
}

export class DoorCell extends Cell<DoorParameters> {
    constructor(cellType?: string) {
        const isOpen = cellType?.startsWith("O") || false;
        const sensorId = parseInt(cellType?.split("-")[1] ?? "", 10);

        const sensorIdStr = isNaN(sensorId) ? "" : ` (${sensorId})`;

        super(
            CellType.Door,
            `Porte${sensorIdStr}`,
            {
                isOpen,
                sensorId: isNaN(sensorId) ? null : sensorId,
            }
        );
    }

    override clone(): DoorCell {
        const clonedCell = this.cloneProperties(new DoorCell(this.type));

        return clonedCell;
    }

    override update(neighbors: Neighbors<Cell>, gameState: GameState): void {
        if (this.isOpen) {
            updateFilling(this, neighbors, gameState.currentCycle)
        }
    };

    override render({key}: {key: string}): ReactNode {
        const { isOpen } = this.parameters;
        const imgSrc = isOpen ? "/open-door.svg" : "/closed-door.svg";
    
        return (
            <CellRenderer
                key={key}
                cell={this}
                customClasses={`door${isOpen ? " door--isOpen" : ""}`}
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

    get isOpen() {
        return this.parameters.isOpen;
    }

    toggle() {
        this.parameters.isOpen = !this.parameters.isOpen;
    }
};
