function DoorCell(
	_coords,
	_isOpen = false,
	_sensorId = undefined,
	_doorKind = undefined
) : Cell(
	_coords,
	"door"
) constructor {
	isOpen = _isOpen;
	sensorId = _sensorId;
	doorKind = _doorKind;
	
	toggleCount = 0;
	toggledRemotely = false;

	canToggle = function() {
		return (
			doorKind != "remote" && (
				doorKind != "once" ||
				toggleCount == 0
			) ||
			doorKind == "remote" && toggledRemotely
		);
	};
	
	clone = function() {
		var cloned = new DoorCell(
			coords,
			isOpen,
			sensorId,
			doorKind
		);
		cloneProperties(cloned);
		
		cloned.toggleCount = toggleCount;
		cloned.toggledRemotely = toggledRemotely;

		return cloned;
	}
	
	update = function(previousCell, matrix) {
		if (
			sensorId != undefined &&
			array_contains(global.triggeredSensors, sensorId)
		) {
			toggleDoor(true);
		}
		
		if (isOpen) {
			updateFilling(self, previousCell, matrix);
		} else {
			reset();
		}
	}
	
	toggleDoor = function(remotely = false) {
		toggledRemotely = remotely;

		if (!canToggle()) {
			return;
		}

		isOpen = !isOpen;
		toggleCount++;	
	}
	
	draw = function(x, y, size, isHovered = false, isClicked = false) {
		global.drawCellBackground(x, y, size);

		var isDoorClicked = isClicked && canToggle();
		var isCurrentlyOpen = isOpen ^ isDoorClicked;
		var doorSprite = getDoorSprite(doorKind, isCurrentlyOpen, filling);
		var scale = getCellScale(size);

		drawSprite(doorSprite, size, x, y, scale);
		
		if (
			isHovered &&
			doorKind != "remote" &&
			canToggle()
		)  {
			var doorActionSprite = getDoorActionSprite(doorKind, isCurrentlyOpen);
			drawSprite(doorActionSprite, size, x, y, scale);
		}
	}
};