function Cell (
	_coords,
	_type,
	_disabled = false
) constructor {
	static drainSpeed = -20;

	coords = _coords;
	type = _type;
	disabled = _disabled;
	
	backgroundSprIndex = getRandomSprBricksIndex();
	
	filling = 0;
	flowSpeed = 0;
	fillerParents = [];
	
	reset = function () {
		filling = 0;
		flowSpeed = 0;
		fillerParents = [];
	};
	
	row = coords[0];
	col = coords[1];

	isEmpty = function() {  return filling == 0; };
	isFilled = function() { return filling == 100; };
	hasFlowSpeed = function() { return flowSpeed > 0 };
	
	setFilling = function(_newValue) {
		if (_newValue < 0) {
			filling = 0;	
		} else if (_newValue > 100) {
			filling = 100;
		} else {
			filling = _newValue;	
		}
	};

	setFlowSpeed = function(_newValue) {
		if (_newValue < 0) {
			flowSpeed = 0;	
		} else if (_newValue> 100) {
			flowSpeed = 100;
		} else {
			flowSpeed = _newValue;	
		}
	};
	
	setFillerParents = function(_parents) {
		fillerParents = global.cloneArray(_parents);
	};

	cloneProperties = function(_clonedCell) {
		_clonedCell.flowSpeed = flowSpeed;
		_clonedCell.filling = filling;
		_clonedCell.fillerParents = fillerParents;

		_clonedCell.backgroundSprIndex = backgroundSprIndex;
	};

	clone = function() {};
	update = function() {};
	
	global.drawCellBackground = function(x, y, size, withDarkerLayer = false) {
	    var sprBackground = getBricksBackground(backgroundSprIndex);
		var scale = getCellScale(size);
		
		drawSprite(sprBackground, size, x, y, scale, withDarkerLayer);
	};
	draw = function(x, y, size, isHovered = false) {
		global.drawCellBackground(x, y, size);
	};
	
	toString = function() {
		if (array_length(fillerParents) > 0) {
	        fillerParentsString = "\n";
	        for (var i = 0; i < array_length(fillerParents); i++) {
	            var parent = fillerParents[i];
	            fillerParentsString += "- (" + string(parent.row) + ", " + string(parent.col) + "), Type: " + string(parent.type) + ", Filling: " + string(parent.filling) + ", FlowSpeed: " + string(parent.flowSpeed);
	            if (i < array_length(fillerParents) - 1) {
	                fillerParentsString += "; \n";
	            }
	        }
	    } else {
	        fillerParentsString = "[]";
	    }
	
	    return "Cell" +
	           "Coords: " + string(row) + ", " + string(col) + ", \n" +
	           "Type: " + type + ", \n" +
	           "Filling: " + string(filling) + ", \n" +
	           "FlowSpeed: " + string(flowSpeed) + ", \n" +
	           "FillerParents: " + fillerParentsString + ", \n" +
	           "\n";
	}
}