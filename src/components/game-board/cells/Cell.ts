import { ReactNode } from "react";
import { GameState } from "@/components/game-state/GameState";
import { Matrix } from "../matrix/Matrix";

export enum CellType {
    Full = "full",
    Empty = "empty",
    Source = "source",
    Exit = "exit",
    Door = "door",
    Sensor = "sensor",
    Pipe = "pipe",
}

export type CellParameters = object;

export abstract class Cell<T extends CellParameters = CellParameters> {
    public static drainSpeed = 20;

    public coords: [number, number];
    public type: CellType;
    public label: string;
    public parameters: T;
    public disabled: boolean;

    public filling: number;
    public fillingParents: Cell[];
    public flowSpeed: number;

    public lastUpdateCycle: number;

    constructor(
        coords: [number, number],
        type: CellType,
        label: string,
        parameters: T = {} as T,
        disabled: boolean = false
    ) {
        this.coords = coords;
        this.type = type;
        this.label = label;
        this.parameters = parameters;
        this.disabled = disabled;

        this.filling = 0;
        this.fillingParents = [];
        this.flowSpeed = 0;

        this.lastUpdateCycle = 0;
    }

    get isEmpty(): boolean {
        return this.filling === 0;
    }

    get isFilled(): boolean {
        return this.filling === 100;
    }

    abstract clone(): Cell<T>;

    abstract update(matrix: Matrix<Cell>, gameState: GameState): void;

    abstract render({key}: {key: string}): ReactNode;

    protected cloneProperties<T extends Cell>(clonedCell: T): T {
        clonedCell.filling = this.filling;
        clonedCell.flowSpeed = this.flowSpeed;
        clonedCell.fillingParents = [...this.fillingParents];
        clonedCell.parameters = { ...this.parameters };
        clonedCell.disabled = this.disabled;

        return clonedCell;
    }

    setFilling(newFillingValue: number) {
        if (newFillingValue < 0) {
            this.filling = 0;
        } else if (newFillingValue > 100) {
            this.filling = 100;
        } else {
            this.filling = newFillingValue;
        }
    }

    setFlowSpeed(newFlowSpeedValue: number) {
        if (newFlowSpeedValue < 0) {
            this.flowSpeed = 0;
        }

        this.flowSpeed = newFlowSpeedValue;
    }

    setFillingParents(parents: Cell[]) {
        this.fillingParents = parents;
    }

    reset() {
        this.setFilling(0);
        this.setFlowSpeed(0);
        this.setFillingParents([]);
    }
}
