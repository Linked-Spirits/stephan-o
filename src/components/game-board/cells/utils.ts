/* const isExcludedNeighbor = (neighbor: Cell): boolean => {    
    const isExcludedType = [
        CellType.Full,
        CellType.Pipe
    ].includes(neighbor.type) 

    const isClosedDoor = 
    neighbor.type === CellType.Door;

    return isExcludedType || isClosedDoor
}  */

import { NeighborDirection, Neighbors } from "../matrix/Matrix.types";
import { Cell, CellType } from "./Cell";
import { DoorCell } from "./DoorCell";

/* const isNeighborRelevant = (neighbor: Cell): boolean => {
    const noFlowSpeed = neighbor.flowSpeed === 0;

    return !(isExcludedNeighbor(neighbor) || noFlowSpeed);
} */

/* const getGravityValidNeighbors = (neighbors: Neighbors<Cell>): Cell[] => {
    const { top, right, left, bottomRight, bottomLeft } = neighbors;

    const directions = [
        { neighbor: right, adjacent: bottomRight },
        { neighbor: left, adjacent: bottomLeft },
    ];

    const result = directions
        .filter(({ neighbor, adjacent }) => 
            neighbor && 
            neighbor.flowSpeed > 0 && 
            (!adjacent || isExcludedNeighbor(adjacent))
        )
        .map(({ neighbor }) => neighbor as Cell); 

    if (top) {
        result.push(top);
    }

    return result;
}; */

/* const isOneNeighborIsExit = (neighbors: Neighbors<Cell>): boolean => {
    const { top, left, right, bottom } = neighbors;

    return [top, left, right, bottom].some(
        (neighbor) => neighbor?.type === CellType.Exit
    );
}; */

/* export const updateFilling = (cell: Cell, neighbors: Neighbors<Cell>) => {
    const flowSpeedNeighbors = getGravityValidNeighbors(neighbors)
        .filter(neighbor => neighbor && isNeighborRelevant(neighbor))
        .map(neighbor => neighbor!.flowSpeed);

    const newFlowSpeed = flowSpeedNeighbors.length === 0
        ? 0
        : flowSpeedNeighbors.reduce(
            (sum, flowSpeed) => sum + flowSpeed, 0
        ) / flowSpeedNeighbors.length

    if (cell.filling === 0 && cell.flowSpeed > 0) {
        cell.setFlowSpeed(0)
    }
    
    if (newFlowSpeed === 0 || isOneNeighborIsExit(neighbors)) {
        cell.setFilling(cell.filling - 20)
    } else {
        cell.setFilling(cell.filling + newFlowSpeed)
    }

    cell.setFlowSpeed(newFlowSpeed);
} */


const isExcludedNeighbor = (neighbor: Cell): boolean => {    
    const excludedTypes = [CellType.Full]

    return [
        excludedTypes.includes(neighbor.type),
        neighbor.type === CellType.Door && !(neighbor as DoorCell).isOpen,
        // neighbor.isEmpty
    ].some(Boolean)
}

const checkTopNeighbor = (neighbors: Neighbors<Cell>): Cell | null => {
    const { top } = neighbors;

    if (!top || isExcludedNeighbor(top)) {
        return null;
    }

    return top;
}

const checkBottomNeighbor = (neighbors: Neighbors<Cell>): Cell | null => {
    const { bottom } = neighbors;

    if (!bottom
        || isExcludedNeighbor(bottom)
        || !bottom.isFilled
    ) {
        return null;
    }

    return bottom;
}

const checkRightNeighbor = (neighbors: Neighbors<Cell>): Cell | null => {
    const { right, bottomRight } = neighbors;

    if (!right || isExcludedNeighbor(right)) {
        return null;
    }

    if (bottomRight && !isExcludedNeighbor(bottomRight) && !bottomRight.isFilled) {
        return null;
    }

    return right;
}

const checkLeftNeighbor = (neighbors: Neighbors<Cell>): Cell | null => {
    const { left, bottomLeft } = neighbors;

    if (!left || isExcludedNeighbor(left)) {
        return null;
    }

    if (bottomLeft && !isExcludedNeighbor(bottomLeft) && !bottomLeft.isFilled) {
        return null;
    }

    return left;
}

/* (bottomLeft
    && !isExcludedNeighbor(bottomLeft)
    && !bottomLeft.isFilled) */

export const updateFilling = (cell: Cell, neighbors: Neighbors<Cell>, currentCycle: number): void => {
    if (cell.lastUpdateCycle >= currentCycle) {
        return;
    }

    cell.lastUpdateCycle = currentCycle;

    const relevantNeighbors = [
        checkTopNeighbor(neighbors),
        checkBottomNeighbor(neighbors),
        checkLeftNeighbor(neighbors),
        checkRightNeighbor(neighbors),
    ].filter(neighbor => neighbor !== null)

    /* const relevantNeighbors: Cell[] = (["top", "left", "right"] as NeighborDirection[])
        .map(direction => neighbors[direction] as Cell)
        .filter(neighbor => neighbor && !isExcludedNeighbor(neighbor))

    if (neighbors.bottom?.isFilled) {
        relevantNeighbors.push(neighbors.bottom)
    } */

    const totalFlowSpeed = relevantNeighbors.reduce((sum, neighbor) => sum + neighbor.flowSpeed, 0);
    const averageFlowSpeed = relevantNeighbors.length ? totalFlowSpeed / relevantNeighbors.length : 0;

    cell.setFlowSpeed(averageFlowSpeed);

    if (cell.flowSpeed > 0) {
        cell.setFilling(cell.filling + cell.flowSpeed);

        return;
    }

    cell.setFilling(cell.filling - Cell.drainSpeed);

    return;
}
