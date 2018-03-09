import {MainMenu} from "../js/scenes/MainMenu.js"
import {TownPixil} from "./scenes/PixilTown.js";
import {storage} from "./data/storage.js";

//data

function saveResolution() {
    localStorage.setItem("resolution", JSON.stringify(resolution));
}

let resolution = JSON.parse(localStorage.getItem("resolution")) || {height: 600, width: 800};
saveResolution();

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [MainMenu, TownPixil],
    pixelArt: true
};

const game = new Phaser.Game(config);

window.onresize = function () {
    game.resize(window.innerWidth, window.innerHeight, 1.0);
    if (storage.mainCamera) {
        storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);
    }
};