let mouseDown = false;

export function drawDebug(game, map) {
    if (debugGraphics) {
        debugGraphics.clear();
        debugGraphics.destroy();
    }
    const debugGraphics = game.add.graphics();
    const tileColor = new Phaser.Display.Color(105, 210, 231, 200);
    const colldingTileColor = new Phaser.Display.Color(243, 134, 48, 200);
    const faceColor = new Phaser.Display.Color(40, 39, 37, 255);
    debugGraphics.clear();

    // Pass in null for any of the style options to disable drawing that component
    map.renderDebug(debugGraphics, {
        tileColor: tileColor,                   // Non-colliding tiles
        collidingTileColor: colldingTileColor,  // Colliding tiles
        faceColor: faceColor                    // Interesting faces, i.e. colliding edges
    });
}

let cursor = false;
let marker;

export function propertyCursor(game) {
    const map = game.map;
    if (!cursor) {
        marker = game.add.graphics();
        marker.lineStyle(3, 0xffffff, 1);
        marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        cursor = true;
    }
    const worldPoint = game.input.activePointer.positionToCamera(game.cameras.main);

    // Rounds down to nearest tile
    const pointerTileX = map.worldToTileX(worldPoint.x);
    const pointerTileY = map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    marker.x = map.tileToWorldX(pointerTileX);
    marker.y = map.tileToWorldY(pointerTileY);
    if (game.input.manager.activePointer.isDown && !mouseDown) {
        mouseDown = true;
        map.layers.forEach((layer) => {
            map.setLayer(layer.name);
            const tile = map.getTileAt(pointerTileX, pointerTileY);
            if (tile) {
                console.log('Properties: ', tile.properties);
            }
        });
    } else if (!game.input.manager.activePointer.isDown && mouseDown) {
        mouseDown = false;
    }
}