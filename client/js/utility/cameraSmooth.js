import {storage} from "../data/storage.js";

export function smoothMoveCameraTowards(target, smoothFactor) {
    if (target) {
        if (smoothFactor === undefined) {
            smoothFactor = 0;
        }
        storage.mainCamera.scrollX = smoothFactor * storage.mainCamera.scrollX + (1 - smoothFactor) * (target.x - storage.mainCamera.width * 0.5);
        storage.mainCamera.scrollY = smoothFactor * storage.mainCamera.scrollY + (1 - smoothFactor) * (target.y - storage.mainCamera.height * 0.5);
    }
}