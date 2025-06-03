function showLoadedLevel() {
	show_message("Niveau chargé : " + levelData.label);	
}

function showMatrix() {
    var cols = matrix.cols;
	var rows = matrix.rows;
    
	var result = "";
	
    for (var i = 0; i < rows; i++) {
        var rowStr = "";
        for (var j = 0; j < cols; j++) {
            var cell = matrix.get(i, j);

            rowStr += cell.type + " ";
        }

		result += rowStr;
		if (i != rows) {
			result += "\n";
		}
    }
	
	show_message(result);
}
