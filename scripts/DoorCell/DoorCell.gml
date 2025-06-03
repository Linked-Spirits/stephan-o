function DoorCell(
	_coords,
	_isOpen = false,
	_sensorId = undefined
) : Cell(
	_coords,
	"door"
) constructor {
	isOpen = _isOpen;
	sensorId = _sensorId;
	
	clone = function() {
		var cloned = new DoorCell(coords, isOpen, sensorId);
		cloneProperties(cloned);

		return cloned;
	}
	
	update = function(previousCell, matrix) {
		if (
			sensorId != undefined &&
			array_contains(global.triggeredSensors, sensorId)
		) {
			toggleDoor();
		}
		
		if (isOpen) {
			updateFilling(self, previousCell, matrix);
		} else {
			reset();
		}
	}
	
	toggleDoor = function() {
		isOpen = !isOpen;
	}
	
	draw = function(x, y, size, isHovered = false, isClicked = false) {
		global.drawCellBackground(x, y, size);

		var scale = getCellScale(size);
		var spriteToDraw;
		
		var isCurrentlyOpen = isOpen ^ isClicked;

		if (isCurrentlyOpen) {
			spriteToDraw = (filling > 0) ? spr_door_open_full : spr_door_open;
		} else {
		    spriteToDraw = spr_door_closed;
		}

		drawSprite(spriteToDraw, size, x, y, scale);
		
		if (isHovered)  {
			drawSprite(isCurrentlyOpen ? spr_lock : spr_unlock, size, x, y, scale);
		}
	}
};