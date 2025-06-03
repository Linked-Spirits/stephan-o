function updateClickedCell() {
	if (hoveredCell != undefined) {
		clickedCell = hoveredCell;
		
		// Debug
		show_debug_message(clickedCell.toString());
	}
}
