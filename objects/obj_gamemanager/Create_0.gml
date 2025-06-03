var levelId = global.selectedLevel;
var level = loadLevel(levelId);

if (level != undefined) {
    levelData = level.data;
	matrix = level.matrix;
} else {
    show_message("Erreur lors du chargement du niveau.");
}

elapsedTime = 0;
updateInterval = 0.25;
shouldUpdate = false;

hoveredCell = undefined;
clickedCell = undefined;

cellSize = max(32, min(room_width / matrix.cols, room_height / matrix.rows));
