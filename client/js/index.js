const version = 2;
const game_name = "pixel_park";

import {MainMenu} from "../js/scenes/MainMenu.js"
import {PixilTown} from "./scenes/PixilTown.js";
import {Voxalia} from "./scenes/Voxalia.js";

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
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [MainMenu, PixilTown, Voxalia],
    pixelArt: true
};

const game = new Phaser.Game(config);

window.addEventListener("resize", function() {
    console.log("resize detected");
    game.resize(window.innerWidth, window.innerHeight, 1.0);
});