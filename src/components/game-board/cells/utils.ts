import { Matrix } from "../matrix/Matrix";
import { Neighbors } from "../matrix/Matrix.types";
import { Cell, CellType } from "./Cell";
import { DoorCell } from "./DoorCell";

const excludedTypes = [CellType.Full]

const isExcludedNeighbor = (neighbor: Cell): boolean => [
    excludedTypes.includes(neighbor.type),
    neighbor.isEmpty,
    neighbor.type === CellType.Door && !(neighbor as DoorCell).isOpen,
].some(Boolean)

const isExcludedBottomNeighbor = (neighbor: Cell): boolean => [
    excludedTypes.includes(neighbor.type),
    neighbor.type === CellType.Door && !(neighbor as DoorCell).isOpen,
].some(Boolean)

const checkTopNeighbor = (neighbors: Neighbors<Cell>): Cell | null => {
    const { top } = neighbors;

    if (!top || isExcludedNeighbor(top)) {
        return null;
    }

    return top;
}

const checkRightNeighbor = (neighbors: Neighbors<Cell>): Cell | null => {
    const { right, bottomRight } = neighbors;

    if (!right || isExcludedNeighbor(right)) {
        return null;
    }

    if (bottomRight && !isExcludedBottomNeighbor(bottomRight)) {
        return null;
    }

    return right;
}

const checkLeftNeighbor = (neighbors: Neighbors<Cell>): Cell | null => {
    const { left, bottomLeft } = neighbors;

    if (!left || isExcludedNeighbor(left)) {
        return null;
    }

    if (bottomLeft && !isExcludedBottomNeighbor(bottomLeft)) {
        return null;
    }

    return left;
}

export const updateFilling = (cell: Cell, matrix: Matrix<Cell>, currentCycle: number): void => {


    /* if (cell.lastUpdateCycle >= currentCycle) {
        return;
    }

    cell.lastUpdateCycle = currentCycle;

    // Vérifier si un des parents est en train de se vider
    const hasEmptyingParent = cell.fillingParents.some(parent => parent.flowSpeed < 0);

    if (hasEmptyingParent) {
        // Si un parent se vide, la cellule se vide aussi
        cell.setFilling(cell.filling - Cell.drainSpeed);
        return;
    }

    const relevantNeighbors = [
        checkTopNeighbor(neighbors),
        checkLeftNeighbor(neighbors),
        checkRightNeighbor(neighbors),
    ].filter(neighbor => neighbor !== null) as Cell[];

    const totalFlowSpeed = relevantNeighbors.reduce((sum, neighbor) => sum + neighbor.flowSpeed, 0);
    const averageFlowSpeed = relevantNeighbors.length ? totalFlowSpeed / relevantNeighbors.length : 0

    cell.setFlowSpeed(averageFlowSpeed);

    if (cell.flowSpeed > 0) {
        cell.setFilling(cell.filling + cell.flowSpeed);
        cell.setFillingParents(relevantNeighbors);
        return;
    }

    cell.setFilling(cell.filling - Cell.drainSpeed);
    cell.setFillingParents([]); // Si l'eau se vide, pas de parents */
    const [row, col] = cell.coords;
    const neighbors = matrix.getNeighbors(row, col);

    /* if (cell.lastUpdateCycle >= currentCycle) {
        return;
    } */

    // cell.lastUpdateCycle = currentCycle;

    // Si la cellule a déjà des parents, on vérifie s'ils se vident
    if (cell.fillingParents.length > 0) {
        const hasEmptyingParents = cell.fillingParents
            .reduce((sum, parent) => sum + matrix.get(...parent.coords).flowSpeed, 0) === 0;

        if (hasEmptyingParents) {
            cell.setFilling(cell.filling - Cell.drainSpeed);

            return;
        }
    }

    if (row === 1 && col === 3) {
        console.log(cell)
        console.log(neighbors)
        console.log("\n")
    }

    const topNeighbor = checkTopNeighbor(neighbors);
    const leftNeighbor = checkLeftNeighbor(neighbors);
    const rightNeighbor = checkRightNeighbor(neighbors);

    const fillingParents = []

    if (topNeighbor !== null) {
        fillingParents.push(topNeighbor)
    }
    if (leftNeighbor !== null) {
        fillingParents.push(leftNeighbor)
    }
    if (rightNeighbor !== null) {
        fillingParents.push(rightNeighbor)
    }

    cell.setFillingParents(fillingParents);

    // Si on n'a toujours pas de fillingParents, on commence à vider la cellule
    /* if (cell.fillingParents.length === 0) {
    cell.setFilling(cell.filling - Cell.drainSpeed);
    cell.setFilling(cell.filling - Cell.drainSpeed);

        cell.setFilling(cell.filling - Cell.drainSpeed);

        return;
    } */

    // ⚡ Mettre à jour les valeurs des parents à chaque cycle
    const totalFlowSpeed = cell.fillingParents
        .reduce((sum, parent) => sum + matrix.get(...parent.coords).flowSpeed, 0);
    const averageFlowSpeed = totalFlowSpeed > 0
        ? totalFlowSpeed / cell.fillingParents.length
        : 0;

    cell.setFlowSpeed(averageFlowSpeed);
    cell.setFilling(cell.filling + cell.flowSpeed);





    // on récupère les relevantNeighbors 
    // si filling = 0 : on met les relevantNeighbors en fillingParents
    // fin si
    // on calcule le totalFlowSpeed (pas de moyenne, juste une somme) 
    // => pour ce calcul, on regarde les fillingParents
    // => on récupère les flowspeed de flowSpeed des parents
    // => si cette valeur vaut 0, on check à nouveau les voisins
    // => on refait les fillingsParents SSI leurs fillingParents sont différent de la cell courante
    // => sinon flowSpeed = 0;
    // On set les valeurs flowspeed et filling 

    // MECANISME A GARDER
    // On vide la cellule si une cellule bottomLeft ou bottomRight se libère
    // A INSERER DANS LA FONCTION DU TOTALFLOWSPEED
    if (cell.fillingParents.some(parent =>
        parent.coords[0] + 1 !== cell.coords[0]
        && !isExcludedBottomNeighbor(matrix.get(parent.coords[0] + 1, parent.coords[1]))
    )) {
        cell.setFilling(cell.filling - Cell.drainSpeed);
        cell.setFlowSpeed(cell.flowSpeed - Cell.drainSpeed);

        return;
    }

    // TODO :
    // - Utiliser disabled pour FullCell et DoorCell closed
    // - 
}
