function getSpriteIndex(sprite) {
	return asset_get_index(sprite);
}

function getRandomSprBricksIndex() {
	return irandom_range(1, 14);
}

function getSprBricks(sprIndex, prefix) {
    var index = sprIndex ?? getRandomSprBricksIndex();
	var spritePrefix = prefix ?? global.backgroundSprPrefix;
    var spriteName = "spr_" + spritePrefix + "_" + string(index);
    var sprite = getSpriteIndex(spriteName);

    if (sprite == -1) {
        show_debug_message("Erreur : sprite " + spriteName + " non trouvé !");
		
		if (!prefix) {
			return spr_bricks_1;	
		} else if (prefix == global.backgroundSprPrefix) {
			return spr_bricks_1;	
		} else if (prefix == global.foregroundSprPrefix) {
			return spr_broken_1;	
		}
    }

    return sprite;
}

function getBricksBackground(sprIndex) {
	return getSprBricks(sprIndex);	
}

function getBricksForeground(sprIndex) {
	return getSprBricks(sprIndex, global.foregroundSprPrefix);	
}

function getCellScale(size) {
	var scale = size / global.defaultSpriteSize;
	return { x: scale, y: scale };
}

function drawSprite(sprite, size, x, y, scale, withDarkerLayer = false) {
	draw_sprite_ext(sprite, 0, x, y, scale.x, scale.y, 0, -1, 1);
	
	if (withDarkerLayer) {
		draw_set_color(global.color_black);
		draw_set_alpha(0.5);
        draw_rectangle(x, y, x + size, y + size, false);
	}
}

function drawPipe(sprite, size, x, y, scale) {
	var spriteIndex = getSpriteIndex("spr_pipe" + sprite);

	drawSprite(spriteIndex, size, x, y, scale);
}