function isExcluded(neighbor, includeEmpty = true) {
	// On exclue une cellule si :
	// - Son type fait parti des types exclus
	var excludedTypes = ["wall", "pipe"];
    var isExcludedType = array_contains(excludedTypes, neighbor.type);
	// - C'est une porte fermée
    var isClosedDoor = neighbor.type == "door" && !neighbor.isOpen;
	// - Elle est vide (si on prend ce critère en compte, on le prend en compte seulement sur les cellules adjacentes)
    var isEmpty = includeEmpty && neighbor.isEmpty();

    return isExcludedType || isClosedDoor || isEmpty;
}

function isInFillerParents(cell, fillerParents) {
	for (var i = 0; i < array_length(fillerParents); i++) {
	    if (cell.row == fillerParents[i].row && cell.col == fillerParents[i].col) {
			return true;	
		}
	}
	
	return false;
}

function checkPipe(cell, pipeDirection, pipe) {
	if (
		!pipe.isEmpty() && 
		!isInFillerParents(cell, pipe.fillerParents) &&
		(
			(pipeDirection == "top" && pipe.directions.bottom) ||
			(pipeDirection == "bottom" && pipe.directions.top) ||
			(pipeDirection == "right" && pipe.directions.left) ||
			(pipeDirection == "left" && pipe.directions.right)
		)
	) {
		return pipe;
	}

	return undefined;
}

function checkNeighbor(cell, neighborDirection, neighbor, bottomNeighbor) {
	if (neighbor == undefined) {
		return undefined;	
	};
	
	// Si le voisin est une cellule de type Source, on le prend en compte sans regarder les autres conditions
	if (neighbor.type == "source") {
		return neighbor;
	}
		
	// Si le voisin est un tuyau, on utilise une fonction différente
	if (neighbor.type == "pipe") {
		return checkPipe(cell, neighborDirection, neighbor);
	}

	// On ne prend pas en compte le voisin si :
	if (
		// - Son unique parent est la cellule courante (= référence vers l'ancienne cellule, avant le clone)
		//(array_length(neighbor.fillerParents) == 1 && neighbor.fillerParents[0] == cell) ||
		// - Si la cellule courante est présente dans les parents du voisin
		isInFillerParents(cell, neighbor.fillerParents) ||
		// - C'est une cellule exclue
		isExcluded(neighbor, true) ||
		// - Son voisin du dessous est une cellule valable (non exclue, l'eau préférera y aller)
		(bottomNeighbor != undefined && !isExcluded(bottomNeighbor, false))
	) {
		return undefined;
	}

	// Le voisin a passé toute les conditions et est donc valide pour le remplissage de la cellule courante
    return neighbor;
}

function getRelevantNeighbors(cell, neighbors) {
    var relevantNeighbors = {
		top: undefined,
		right: undefined,
		left: undefined,
		bottom: undefined
	};

    var top = neighbors.top;
    var left = neighbors.left;
    var bottomLeft = neighbors.bottomLeft;
    var right = neighbors.right;
    var bottomRight = neighbors.bottomRight;
	var bottom = neighbors.bottom;

	// La cellule au-dessus peut-elle remplir la cellule courante ?
    var topNeighbor = checkNeighbor(cell, "top", top, undefined);
	// La cellule à gauche peut-elle remplir la cellule courante ? Ou l'eau qu'elle contient préférera aller vers la cellule sous celle-ci (bottomLeft) ?
    var leftNeighbor = checkNeighbor(cell, "left", left, bottomLeft);
	// La cellule à droite peut-elle remplir la cellule courante ? Ou l'eau qu'elle contient préférera aller vers la cellule sous celle-ci (bottomRight) ?
    var rightNeighbor = checkNeighbor(cell, "right", right, bottomRight);

	// La cellule au-dessous peut-elle remplir la cellule courante ? Seulement si c'est un tuyau en dessous
    var bottomNeighbor = bottom != undefined && bottom.type == "pipe"
		? checkPipe(cell, "bottom", bottom)
		: undefined;
	
	if (topNeighbor != undefined) {
		relevantNeighbors.top = topNeighbor;
	}
	if (leftNeighbor != undefined) {
		relevantNeighbors.left = leftNeighbor;
	}
	if (rightNeighbor != undefined) {
		relevantNeighbors.right = rightNeighbor;
	}
	if (bottomNeighbor != undefined) {
		relevantNeighbors.bottom = bottomNeighbor;
	}

    return relevantNeighbors;
}

function computeFlowSpeed(cell, neighbors) {
	var newFlowSpeed = 0;
	var newFillerParents = [];

	// Récupération des parents valides, qui peuvent remplir la cellule courante
	var relevantNeighbors = getRelevantNeighbors(cell, neighbors);

	var top = relevantNeighbors.top;
    var left = relevantNeighbors.left;
    var right = relevantNeighbors.right;
	var bottom = relevantNeighbors.bottom;
	var hasTop = top != undefined;
    var hasLeft = left != undefined;
    var hasRight = right != undefined;
	var hasBottom = bottom != undefined;

    var flowTop = hasTop ? top.flowSpeed : 0;
    var flowLeft = hasLeft ? left.flowSpeed : 0;
    var flowRight = hasRight ? right.flowSpeed : 0;
	var flowBottom = hasBottom ? bottom.flowSpeed : 0;

    if (hasTop && hasLeft && hasRight) {
        newFlowSpeed = flowTop * 1.2 + flowLeft * 0.8 + flowRight * 0.8;
    } else if (hasTop && (hasLeft || hasRight)) {
        newFlowSpeed = flowTop + (hasLeft ? flowLeft : flowRight);
    } else if (hasTop) {
        newFlowSpeed = flowTop;
    } else if (hasLeft && hasRight) {
        newFlowSpeed = flowLeft * 0.8 + flowRight * 0.8;
    } else if (hasLeft) {
        newFlowSpeed = flowLeft;
    } else if (hasRight) {
        newFlowSpeed = flowRight;
    }
	
	if (hasBottom) {
		if (hasTop || hasLeft && hasRight) {
			newFlowSpeed += flowBottom * 0.8;
		} else {
			newFlowSpeed += flowBottom;
		}
		
		array_push(newFillerParents, bottom);
	}
	
	if (hasTop) array_push(newFillerParents, top);
	if (hasLeft) array_push(newFillerParents, left);
	if (hasRight) array_push(newFillerParents, right);

	return {
		flowSpeed: newFlowSpeed,
		fillerParents: newFillerParents
	};
}

function updateFilling(cell, previousCell, matrix) {
	var neighbors = matrix.getNeighbors(previousCell.row, previousCell.col);

	var computedFlowSpeed = computeFlowSpeed(previousCell, neighbors);
	
	cell.setFillerParents(computedFlowSpeed.fillerParents); 
	cell.setFlowSpeed(computedFlowSpeed.flowSpeed);
	cell.setFilling(
		previousCell.filling + (
		computedFlowSpeed.flowSpeed > 0
			? computedFlowSpeed.flowSpeed
			: Cell.drainSpeed
		)
	);
}