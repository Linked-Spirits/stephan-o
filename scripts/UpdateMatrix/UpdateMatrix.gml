function updateMatrix() {
    var newMatrix = [];

    for (var i = 0; i < matrix.rows; i++) {
        newMatrix[i] = array_create(matrix.cols, undefined);

        for (var j = 0; j < matrix.cols; j++) {
            var cell = matrix.get(i, j);

			// Ne clone que les cellules interactives
            if (array_contains([
				"empty",
				"door",
				"sensor",
				"pipe",
				"exit",
				"trap"
			], cell.type)) {
                var cloned = cell.clone();

                cloned.update(cell, matrix);

				if (cell.type == "door" && clickedCell == cell) {
					cloned.toggleDoor();
				}

                newMatrix[i][j] = cloned;
            } else {
                newMatrix[i][j] = cell;
            }
        }
    }

    matrix = new Matrix(newMatrix);
	clickedCell = undefined;
}
