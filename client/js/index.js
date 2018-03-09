const version = 1;
const game_name = "pixel_park";

import {MainMenu} from "../js/scenes/MainMenu.js"
import {PixilTown} from "./scenes/PixilTown.js";
import {Voxalia} from "./scenes/Voxalia.js";
import {storage} from "./data/storage.js";

//data

function saveResolution() {
    localStorage.setItem("resolution", JSON.stringify(resolution));
}

let resolution = JSON.parse(localStorage.getItem("resolution")) || {height: 600, width: 800};
saveResolution();

const config = {
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'matter',
        matter: {
            gravity: {y: 0},
            enableSleep: true,
            debug: false
        }
    },
    scene: [MainMenu, PixilTown, Voxalia],
    pixelArt: true
};

const game = new Phaser.Game(config);

window.onresize = function () {
    game.resize(window.innerWidth, window.innerHeight, 1.0);
    if (storage.mainCamera) {
        storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);
    }
};

storage.version = version;
storage.game_name = game_name;