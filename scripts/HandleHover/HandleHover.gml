function updateHoveredCell() {
    var mx = device_mouse_x_to_gui(0);
    var my = device_mouse_y_to_gui(0);

    var col = floor(mx / cellSize);
    var row = floor(my / cellSize);

    if (matrix != undefined && matrix.isValidCoords(row, col)) {
        hoveredCell = matrix.get(row, col);
    } else {
        hoveredCell = undefined;
    }
}
