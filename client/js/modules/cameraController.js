let cameraTarget = undefined;
const smoothFactor = 0.9;

export function setTarget(target) {
    if (target !== undefined) {
        cameraTarget = target;
    }

}

export function update(game) {
    const camera = game.cameras.main;
    const target = cameraTarget;
    camera.scrollX = smoothFactor * camera.scrollX + (1 - smoothFactor) * (target.x - camera.width * 0.5);
    camera.scrollY = smoothFactor * camera.scrollY + (1 - smoothFactor) * (target.y - camera.height * 0.5);
}

export function setCameraPosition(game, position) {
    const camera = game.cameras.main;
    camera.scrollX = camera.scrollX + (position.x - camera.width * 0.5);
    camera.scrollY = camera.scrollY + (position.y - camera.height * 0.5);
}