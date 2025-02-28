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

const getNeighbor = (neighbors: Neighbors<Cell>, neighborCoords: [number, number]): Cell | null => {
    const neighborsCells = Object.values(neighbors)

    return neighborsCells.find(neighbor => (
        neighbor?.coords[0] === neighborCoords[0] &&
        neighbor?.coords[1] === neighborCoords[1]
    )) ?? null
}

const computeFlowSpeed = (cell: Cell, neighbors: Neighbors<Cell>): number => {
    // => Récupération des parents "morts"
    const fillerParents = cell.fillerParents
        .map(parent => getNeighbor(neighbors, parent))
        .filter(parent => !!parent)
    const parentsToExclude: [number, number][] = []

    fillerParents.forEach(parent => {
        if (
            parent.isEmpty
            //|| parent.fillerParents.length === 1 && parent.fillerParents[0] === cell.coords
        ) {
            parentsToExclude.push(parent.coords)
        }
    })

    // => Récupération de nouveaux parents
    // On commence par récupérer les voisins valides
    const newFillerParents: [number, number][] = getRelevantNeighbors(neighbors)
        // On retire les parents actuels
        .filter(neighbor => !cell.fillerParents.includes(neighbor.coords))
        .filter(neighbor => (
            // On accepte les voisins qui sont des cellules Source
            neighbor.type === CellType.Source ||
            // et les voisins qui ont au moins 1 parent autre que la cellule courante
            neighbor.fillerParents.filter(parent => parent !== cell.coords).length >= 1
        ))
        .map(parent => parent.coords)

    // => Mise à jour des parents en excluant les parents vides
    cell.setFillerParents([
        // Exclusion des parents "morts"
        ...cell.fillerParents,//.filter(parent => parentsToExclude.includes(parent)),
        // Ajout des nouveaux parents
        ...newFillerParents
    ]);

    // => Récupération des cellules des parents (mis à jour)
    const updatedFillerParents = cell.fillerParents
        .map(parent => getNeighbor(neighbors, parent))
        .filter(parent => !!parent)

    // => On vérifie si présence d'une boucle infinie de parentalité
    const hasInfiniteFillingLoop = updatedFillerParents
        .every(parent => (
            parent.fillerParents.length === 1 &&
            parent.fillerParents[0] === cell.coords
        ))

    if (hasInfiniteFillingLoop) {
        return 0
    }

    // Si la cellule a 1 parent
    // Alors on check ce parent, si celui-ci a au moins 1 autre parent autre que la cellule courante alors on retourne 0 

    // => Récupération de la valeur maximale de flowSpeed chez les parents 
    const maxParentFlowSpeed = Math.max(...updatedFillerParents.map(parent => parent.flowSpeed))

    if (
        cell.isEmpty
        || cell.flowSpeed > maxParentFlowSpeed
    ) {
        return updatedFillerParents.reduce((sum, parent) => sum + parent.flowSpeed, 0);
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
//      OU ALORS => Si le seul parent du voisin est la cellule courante et inversement, on set flowSpeed à 0

//      Si 
//
// - Utiliser disabled pour FullCell et DoorCell closed



    /* const removedParents = fillerParents.filter(parent => {
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
    } */