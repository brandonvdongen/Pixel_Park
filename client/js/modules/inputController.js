const controls = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    interact: 0
};
const keyBinds = {
    KeyW: "up",
    KeyA: "left",
    KeyS: "down",
    KeyD: "right",
    KeyE: "interact",
    Space: "interact"
};

let scene;
let playerID;

function getKey(key) {
    if (keyBinds[key]) {
        return keyBinds[key];
    }
}

let started = false;

export function init(id, game) {
    if (id && game) {
        scene = game;
        playerID = id;
        scene[playerID].controls = controls;
    }
    if (!started) {
        document.addEventListener("keydown", (ev) => {
            const button = getKey(ev.code);
            if (!controls[button] && button !== undefined) {
                controls[button] = 1;
                // console.log(scene[playerID].controls);
                if (button === "interact") {
                    // interact(getTileUnderPlayer(game));
                }
            }
        });

        document.addEventListener("keyup", (ev) => {
            const button = getKey(ev.code);
            if (controls[button]) {
                controls[button] = 0;
            }
        });
        started = true;
    } else {
        console.log("refreshing instance");
    }
}
