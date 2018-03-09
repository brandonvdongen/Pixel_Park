const keyBinds = {
    KeyW: "up",
    KeyA: "left",
    KeyS: "down",
    KeyD: "right"
};

export function getKeyBind(key) {
    if (keyBinds[key]) {
        return keyBinds[key];
    }
}