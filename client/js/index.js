//scenes
import {MainMenu} from "../js/scenes/MainMenu.js"
import {TownPixil} from "./scenes/TownPixil.js";


//data
import {storage} from "./data/storage.js";

function saveResolution() {
    localStorage.setItem("resolution", JSON.stringify(resolution));
}

let resolution = JSON.parse(localStorage.getItem("resolution")) || {height: 600, width: 800};
console.log("resolution:", resolution);
saveResolution();

const config = {
    type: Phaser.AUTO,
    width: resolution.width,
    height: resolution.height,
    scene: [MainMenu,TownPixil],
};

const game = new Phaser.Game(config);