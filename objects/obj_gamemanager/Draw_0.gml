for (var i = 0; i < matrix.rows; i++) {
    for (var j = 0; j < matrix.cols; j++) {
        var cell = matrix.get(i, j);
		var isHovered = hoveredCell != undefined && hoveredCell == cell;
		var isClicked = clickedCell != undefined && clickedCell == cell;
		
		if (cell != undefined) {
            cell.draw(
                j * cellSize,
                i * cellSize,
                cellSize,
                isHovered,
                isClicked
            );
        }
    }
}

if (global.victory != undefined) {
	if (global.victory) {
		show_message("Victoire !");	
	} else {
		show_message("Défaite...");	
	}
}