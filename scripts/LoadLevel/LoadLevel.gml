function getFilePath(filename, ext) {
	return "levels/level_" + filename + ext;
};

function loadData(levelId) { 
    var path = getFilePath(levelId, ".json");
    var file = file_text_open_read(path);
    var jsonString = "";
	
    if (file == -1) {
        show_error("Impossible d'ouvrir le fichier JSON : " + path, true);
        return undefined;
    }
    
    while (!file_text_eof(file)) {
        var line = file_text_read_string(file);
        jsonString += line;
		file_text_readln(file);
    }

    file_text_close(file);
    
    return json_parse(jsonString);
}

function loadMatrix(levelId) {
    var path = getFilePath(levelId, ".csv");
    var file = file_text_open_read(path);
	var csvData = [];
	
    if (file == -1) {
        show_error("Impossible d'ouvrir le fichier CSV : " + path, true);
        return undefined;
    }

    while (!file_text_eof(file)) {
        var line = file_text_read_string(file);
        csvData[array_length(csvData)] = string_split(line, ",");
		file_text_readln(file);
    }
    
    file_text_close(file);

    return csvData;
}

function getPipeConnections(cellType) {
	switch (cellType) {
		case "pipe-t-r": return {top: true, right: true, bottom: false, left: false};
		case "pipe-t-b": return {top: true, right: false, bottom: true, left: false};
		case "pipe-t-l": return {top: true, right: false, bottom: false, left: true};
		case "pipe-r-b": return {top: false, right: true, bottom: true, left: false};
		case "pipe-r-l": return {top: false, right: true, bottom: false, left: true};
		case "pipe-b-l": return {top: false, right: false, bottom: true, left: true};
		case "pipe-t-r-b": return {top: true, right: true, bottom: true, left: false};
		case "pipe-t-r-l": return {top: true, right: true, bottom: false, left: true};
		case "pipe-t-b-l": return {top: true, right: false, bottom: true, left: true};
		case "pipe-r-b-l": return {top: false, right: true, bottom: true, left: true};
		case "pipe-t-r-b-l": return {top: true, right: true, bottom: true, left: true};
		default : return undefined;
	}
}

function buildPipeCell(cellType, coords) {
	var pipeConnections= getPipeConnections(cellType);

	if (pipeConnections != undefined) {
		return new PipeCell(coords, pipeConnections);
	}

	return new WallCell(coords);
}

function buildDoorCell(cellType, arg, coords) {
	show_debug_message(cellType);
	show_debug_message(arg);
	show_debug_message(coords);
	show_debug_message("\n");

	switch (cellType) {
		case "door-closed":
			return new DoorCell(coords, false, arg, "classic"); // arg = sensorId
		case "door-open":
			return new DoorCell(coords, true, arg, "classic");  // arg = sensorId
		case "door-once-closed":
			return new DoorCell(coords, false, arg, "once"); // arg = sensorId
		case "door-once-open":
			return new DoorCell(coords, true, arg, "once");  // arg = sensorId
		case "door-remote-closed":
			return new DoorCell(coords, false, arg, "remote"); // arg = sensorId
		case "door-remote-open":
			return new DoorCell(coords, true, arg, "remote");  // arg = sensorId
	}
}

function buildCell(cellType, coords) {
	var parts = string_split(cellType, "/");
	var baseType = parts[0];
	var arg = array_length(parts) > 1 ? real(parts[1]) : undefined;

	switch (baseType) {
		case "source":
			return new SourceCell(coords, arg); // arg = flowSpeed
		case "empty":
			return new EmptyCell(coords);
		case "sensor":
			return new EmptyCell(coords, arg); // arg = sensorId
		case "exit":
			return new ExitCell(coords);
		case "trap":
			return new ExitCell(coords, true);
		default:
			if (string_starts_with(baseType, "door")) {
				return buildDoorCell(baseType, arg, coords);
			}
			if (string_starts_with(baseType, "pipe")) {
				return buildPipeCell(baseType, coords);
			}
			return new WallCell(coords);
	}
}


function parseLevelMatrix(levelMatrix) {
    var matrix = [];
    
    for (var i = 0; i < array_length(levelMatrix); i++) {
        var row = levelMatrix[i];
        var matrixRow = [];
        
        for (var j = 0; j < array_length(row); j++) {
            var cellType = string_trim(row[j]);
			var coords = [i, j];

            matrixRow[j] = buildCell(cellType, coords);
        }
        matrix[i] = matrixRow;
    }
    
    return matrix;
}

function loadLevel(levelId) {
    var data = loadData(levelId);
    var rawMatrix = loadMatrix(levelId);
	
    if (data == undefined || rawMatrix == undefined) return;
	
	var simpleMatrix = parseLevelMatrix(rawMatrix);
	var matrix = new Matrix(simpleMatrix);

    return {
        data: data,
        matrix: matrix
    };
};
