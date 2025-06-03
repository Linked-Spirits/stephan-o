function PipeCell(
	_coords,
	_directions = {
		top: true,
		right: true,
		bottom: true,
		left: true
	}
) : Cell(
	_coords,
	"pipe"
) constructor {
	directions = _directions;
	
	clone = function() {
		var cloned = new PipeCell(coords, directions);
		cloneProperties(cloned);

		return cloned;
	}
	
	update = function(previousCell, matrix) {
		updatePipeFilling(self, previousCell, matrix);
	} 
	
	draw = function(x, y, size, isHovered = false, isClicked = false) {
		global.drawCellBackground(x, y, size);

		var scale = getCellScale(size);
		var pipeToDraw = "";
		
		if (directions.top) {
			pipeToDraw += "_top";
		};
		if (directions.right) {
			pipeToDraw += "_right";
		};
		if (directions.bottom) {
			pipeToDraw += "_bottom";
		};
		if (directions.left) {
			pipeToDraw += "_left";
		};
		if (filling > 0) {
			pipeToDraw += "_full";	
		};

		if (pipeToDraw != "") {
			drawPipe(pipeToDraw, size, x, y, scale);
		};
	}
};
