function WallCell(
	_coords
) : Cell(
	_coords,
	"wall"
) constructor {
	
	clone = function() {
		var cloned = new WallCell(coords);
		cloneProperties(cloned);

		return cloned;
	}
};