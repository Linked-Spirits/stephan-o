// Convertit delta_time (en microsecondes) en secondes
elapsedTime += delta_time / 1_000_000;
shouldUpdate = (elapsedTime >= 0.25);

// Appelle animate() à chaque frame, même sans update logique
matrix.forEachCell(function(cell) {
	if (cell.type == "empty" || cell.type == "sensor") {
        cell.animate();
    }
});

if (shouldUpdate) {
	elapsedTime = 0;

    updateMatrix();
}

updateHoveredCell();
