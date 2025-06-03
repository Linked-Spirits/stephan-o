function SourceCell(
	_coords,
	_flowSpeed = 10
) : Cell(
	_coords,
	"source"
) constructor {	
	setFlowSpeed(_flowSpeed);
	setFilling(100);
	
	clone = function() {
		var cloned = new SourceCell(coords, flowSpeed);
		cloneProperties(cloned);

		return cloned;
	}
	
	draw = function(x, y, size, isHovered = false, isClicked = false) {
		global.drawCellBackground(x, y, size);

		var scale = getCellScale(size);
		
		drawSprite(spr_source, size, x, y, scale);
	}
};
