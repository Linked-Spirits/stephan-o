global.defaultSpriteSize = 192;

global.backgroundSprPrefix = "bricks";
global.foregroundSprPrefix = "broken";

global.color_gray = make_color_rgb(193, 185, 181);
global.color_black= make_color_rgb(0, 0, 0);



global.cloneArray = function(arr) {
	var newArr = array_create(array_length(arr));
	for (var i = 0; i < array_length(arr); i++) {
		newArr[i] = arr[i];
	}
	return newArr;
};
