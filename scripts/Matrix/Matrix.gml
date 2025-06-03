function Matrix(_data) constructor {
    data = _data;
	
	rows = array_length(data);
	cols = array_length(data[0]);
	
	isValidCoords = function(x, y) {
		return x >= 0 && y >= 0 && x < rows && y < cols;
	}

    
    get = function(x, y) {
        if (!isValidCoords(x, y)) {
            return undefined;
        }

        return data[x][y];
    };

    set = function(x, y, cell) {
        if (!isValidCoords(x, y)) {
            show_error("Coordonnées en dehors de la matrice", true);

            return;
        }

        data[x][y] = cell;
    };

    size = function() {
        return {
			rows: rows,
			cols: cols
		};
    };
	
	getNeighbors = function(x, y) {
		return {
            top: get(x - 1, y),
            right: get(x, y + 1),
            bottom: get(x + 1, y),
            left: get(x, y - 1),
            topRight: get(x - 1, y + 1),
            topLeft: get(x - 1, y - 1),
            bottomRight: get(x + 1, y + 1),
            bottomLeft: get(x + 1, y - 1),
        };
	};
	
	forEachCell = function(callback) {
	    for (var i = 0; i < rows; i++) {
	        for (var j = 0; j < cols; j++) {
	            var cell = get(i, j);

	            if (cell != undefined) {
	                callback(cell, i, j);
	            }
	        }
	    }
	};
}
