function EmptyCell(
	_coords,
	_sensorId = undefined
) : Cell(
	_coords,
	_sensorId == undefined ? "empty" : "sensor"
) constructor {
	sensorId = _sensorId;
	
	foregroundSprIndex = getRandomSprBricksIndex();

	waterRotation = 0;
	waterScale = 0;
	targetWaterScale = 0;

	clone = function() {
		var cloned = new EmptyCell(coords, sensorId);
		cloneProperties(cloned);
		
		cloned.foregroundSprIndex = foregroundSprIndex;
		cloned.waterRotation = waterRotation;
		cloned.waterScale = waterScale;
		cloned.targetWaterScale = targetWaterScale;

		return cloned;
	}
	
	update = function(previousCell, matrix) {
		updateFilling(self, previousCell, matrix);
		
		targetWaterScale = clamp(filling / 100, 0, 1);
		
		if (sensorId != undefined) {
			var index = array_get_index(global.triggeredSensors, sensorId);
			if (index != -1) {
				array_delete(global.triggeredSensors, index, 1);
			}

			if (previousCell.filling == 0 && filling > 0) {
				array_push(global.triggeredSensors, sensorId);
			}
		}
	}
	
	animate = function() {
		waterScale = lerp(waterScale, targetWaterScale, 0.1);
		
		waterRotation += 1;
	    if (waterRotation >= 360) {
	        waterRotation = 0;
	    }
	}

	draw = function(x, y, size, isHovered = false, isClicked = false) {
		global.drawCellBackground(x, y, size, true);

		var sprForeground = getBricksForeground(foregroundSprIndex);
		var scale = getCellScale(size);

		if (waterScale > 0.01) {
			var adjustedScale = waterScale * scale.x * 0.7071;
			var centerX = x + size / 2;
			var centerY = y + size / 2;
			var angle =  foregroundSprIndex % 2 == 0 ? waterRotation : -waterRotation;

			draw_sprite_ext(
				spr_water,
				0,
				centerX,
				centerY,
				adjustedScale,
				adjustedScale,
				angle,
				c_white,
				1
			);
		}

		drawSprite(sprForeground, size, x, y, scale);
		
		if (sensorId != undefined) {
			drawSprite(spr_sensor, size, x, y, scale);
		}
	};
};
