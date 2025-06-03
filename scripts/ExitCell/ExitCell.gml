function ExitCell(
	_coords,
	_isTrap = false
) : Cell(
	_coords,
	_isTrap ? "trap": "exit"
) constructor {
	isTrap = _isTrap;

	clone = function() {
		var cloned = new ExitCell(coords, isTrap);
		cloneProperties(cloned);

		return cloned;
	}
	
	update = function(previousCell, matrix) {
		updateFilling(self, previousCell, matrix);

		if (previousCell.filling > 0 && filling > 0) {
			if (isTrap) {
				global.victory = false;
			} else {
				global.victory = true;
			}
		}
	}
	
	draw = function(x, y, size, isHovered = false, isClicked = false) {
		global.drawCellBackground(x, y, size);

		var scale = getCellScale(size);
		var spriteToDraw;

		if (isTrap) {
		    spriteToDraw = (filling > 0) ? spr_trap_full : spr_trap;
		} else {
		    spriteToDraw = (filling > 0) ? spr_exit_full : spr_exit;
		}

		drawSprite(spriteToDraw, size, x, y, scale);
	}
};
