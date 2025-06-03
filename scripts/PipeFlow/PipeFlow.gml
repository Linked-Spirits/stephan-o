function checkPipeNeighbor(cell, neighbor) {
	if (neighbor == undefined) {
		return undefined;	
	};
	
	// On ne prend pas en compte le voisin si :
	if (
		// Le tuyau voisin est vide
		neighbor.isEmpty() ||
		// - Si la cellule courante est présente dans les parents du voisin
		isInFillerParents(cell, neighbor.fillerParents)
	) {
		return undefined;
	}

	// Le voisin a passé toute les conditions et est donc valide pour le remplissage de la cellule courante
    return neighbor;
}

function getRelevantPipeNeighbors(cell, neighbors) {
    var relevantNeighbors = {
		top: undefined,
		right: undefined,
		left: undefined,
		bottom: undefined
	};

    var top = neighbors.top;
	var bottom = neighbors.bottom;
    var right = neighbors.right;
	var left = neighbors.left;

    var topNeighbor = undefined;
	var bottomNeighbor = undefined;
    var leftNeighbor = undefined;
    var rightNeighbor = undefined;
	
	if (cell.directions.top) {
		topNeighbor = checkPipeNeighbor(cell, top);
	}
	if (cell.directions.bottom) {
		bottomNeighbor = checkPipeNeighbor(cell, bottom);
	}
	if (cell.directions.left) {
		leftNeighbor = checkPipeNeighbor(cell, left);
	}
	if (cell.directions.right) {
		rightNeighbor = checkPipeNeighbor(cell, right);
	}

	if (topNeighbor != undefined) {
		relevantNeighbors.top = topNeighbor;
	}
	if (bottomNeighbor != undefined) {
		relevantNeighbors.bottom = bottomNeighbor;
	}
	if (leftNeighbor != undefined) {
		relevantNeighbors.left = leftNeighbor;
	}
	if (rightNeighbor != undefined) {
		relevantNeighbors.right = rightNeighbor;
	}

    return relevantNeighbors;
}

function computePipeFlowSpeed(cell, neighbors) {
	var newFlowSpeed = 0;
	var newFillerParents = [];

	var relevantNeighbors = getRelevantPipeNeighbors(cell, neighbors);
	
	var top = relevantNeighbors.top;
    var left = relevantNeighbors.left;
    var right = relevantNeighbors.right;
	var bottom = relevantNeighbors.bottom;
	var hasTop = top != undefined;
    var hasLeft = left != undefined;
    var hasRight = right != undefined;
	var hasBottom = bottom != undefined;
	
	if (hasTop) {
		newFlowSpeed += top.flowSpeed;
		array_push(newFillerParents, top);
	}
	if (hasLeft) {
		newFlowSpeed += left.flowSpeed;
		array_push(newFillerParents, left);
	}
	if (hasRight) {
		newFlowSpeed += right.flowSpeed;
		array_push(newFillerParents, right);
	}
	if (hasBottom) {
		newFlowSpeed += bottom.flowSpeed;
		array_push(newFillerParents, bottom);
	}

	return {
		flowSpeed: newFlowSpeed,
		fillerParents: newFillerParents
	};
}

function updatePipeFilling(cell, previousCell, matrix) {
	var neighbors = matrix.getNeighbors(previousCell.row, previousCell.col);

	var computedFlowSpeed = computePipeFlowSpeed(previousCell, neighbors);
	
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