import { Matrix } from "../matrix/Matrix";
import { Neighbors } from "../matrix/Matrix.types";
import { Cell, CellType } from "./Cell";
import { DoorCell } from "./DoorCell";

const excludedTypes = [CellType.Full]

const isExcludedNeighbor = (neighbor: Cell): boolean => [
    excludedTypes.includes(neighbor.type),
    neighbor.isEmpty,
    neighbor.type === CellType.Door && (neighbor as DoorCell).isClosed,
].some(Boolean)

const isExcludedBottomNeighbor = (neighbor: Cell): boolean => [
    excludedTypes.includes(neighbor.type),
    neighbor.type === CellType.Door && (neighbor as DoorCell).isClosed,
].some(Boolean)

const checkNeighbor = (neighbor: Cell | null, bottomNeighbor: Cell | null = null): Cell | null => {
    if (!neighbor || isExcludedNeighbor(neighbor)) {
        return null;
    }

    if (bottomNeighbor && !isExcludedBottomNeighbor(bottomNeighbor)) {
        return null;
    }

    return neighbor;
}

const getRelevantNeighbors = (neighbors: Neighbors<Cell>): Cell[] => {
    const {
        top,
        left,
        bottomLeft,
        right,
        bottomRight
    } = neighbors
    const relevantNeighbors = []

    const topNeighbor = checkNeighbor(top);
    const leftNeighbor = checkNeighbor(left, bottomLeft);
    const rightNeighbor = checkNeighbor(right, bottomRight);

    if (topNeighbor !== null) {
        relevantNeighbors.push(topNeighbor)
    }
    if (leftNeighbor !== null) {
        relevantNeighbors.push(leftNeighbor)
    }
    if (rightNeighbor !== null) {
        relevantNeighbors.push(rightNeighbor)
    }

    return relevantNeighbors
}

const computeFlowSpeed = (cell: Cell, neighbors: Neighbors<Cell>): number => {
    const otherParents = getRelevantNeighbors(neighbors)
        .filter(neighbor => !cell.fillerParents.includes(neighbor.coords))
        .filter(neighbor => (
            neighbor.type === CellType.Source ||
            neighbor.fillerParents.filter(parent => parent !== cell.coords).length >= 1
        ))
        .map(parent => parent.coords)

    cell.setFillerParents([...cell.fillerParents, ...otherParents])

    const fillerParents = cell.fillerParents
        .map(parent => Object.values(neighbors)
            .find(neighbor => neighbor?.coords === parent))
        .filter(parent => !!parent)

    const maxParentFlowSpeed = Math.max(...fillerParents.map(parent => parent.flowSpeed))

    const removedParents = fillerParents.filter(parent => {
        const bottomCoords = [parent.coords[0] + 1, parent.coords[1]]
        const parentBottomNeighbor = Object.values(neighbors)
            .find(neighbor => (
                neighbor?.coords[0] === bottomCoords[0] &&
                neighbor?.coords[1] === bottomCoords[1]
            ))

        return parentBottomNeighbor && !isExcludedBottomNeighbor(parentBottomNeighbor)
    })

    if (removedParents.length > 0) {
        cell.setFillerParents(cell.fillerParents.filter(parent => removedParents.map(parent => parent.coords).includes(parent)))

        return 0;
    }

    if (
        cell.isEmpty
        || cell.flowSpeed > maxParentFlowSpeed
    ) {
        return fillerParents.reduce((sum, parent) => sum + parent.flowSpeed, 0);
    }

    return maxParentFlowSpeed
}

export const updateFilling = (cell: Cell, matrix: Matrix<Cell>, currentCycle: number): void => {
    if (cell.lastUpdateCycle >= currentCycle) {
        return;
    }

    cell.lastUpdateCycle = currentCycle;

    const [row, col] = cell.coords;
    const neighbors = matrix.getNeighbors(row, col);

    cell.setFlowSpeed(computeFlowSpeed(cell, neighbors));
    cell.setFilling(cell.filling + (cell.flowSpeed || Cell.drainSpeed));

    if (cell.isEmpty) {
        cell.setFillerParents([])
    }
}

// TODO :
// - ??? / Si on a un parent avec flowSpeed à 0, que faire ? (vidage par le bas)
// - !!! / Si en checkant les parents, on se rend compte que la cellule courante est dans les parents du parent
//      Alors on regarde les autres parents, si la somme de leur flowSpeed est à 0, alors on set flowSpeed à 0.
//
// - Utiliser disabled pour FullCell et DoorCell closed