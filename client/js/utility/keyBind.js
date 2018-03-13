const controls = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    interact: 0
};

export function getControls() {
    return Object.assign({}, controls);
}

const keyBinds = {
    KeyW: "up",
    KeyA: "left",
    KeyS: "down",
    KeyD: "right",
    KeyE: "interact",
    Space: "interact"
};

export function getKey(key) {
    if (keyBinds[key]) {
        return keyBinds[key];
    }
}