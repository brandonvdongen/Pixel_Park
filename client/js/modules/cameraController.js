export function smoothCamera(game, smoothFactor) {
    if (!game.cameraTarget) game.cameraTarget = game.player.sprite;
    else {
        if (smoothFactor === undefined) {
            smoothFactor = 0;
        }
        const camera = game.cameras.main;
        const target = game.cameraTarget;
        camera.scrollX = smoothFactor * camera.scrollX + (1 - smoothFactor) * (target.x - camera.width * 0.5);
        camera.scrollY = smoothFactor * camera.scrollY + (1 - smoothFactor) * (target.y - camera.height * 0.5);
    }
}

export function setCameraToWorldXY(game, target) {
    const camera = game.cameras.main;
    camera.scrollX = camera.scrollX + (target.x - camera.width * 0.5);
    camera.scrollY = camera.scrollY + (target.y - camera.height * 0.5);
}


window.onresize = function () {
    if (game.cameras.main) {
        game.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);
    }
};