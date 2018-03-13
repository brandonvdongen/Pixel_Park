import * as preloader from "../utility/preloader.js";
import * as playerController from "../modules/playerController.js";

export class MainMenu extends Phaser.Scene {

    constructor() {
        super({key: 'MainMenu'});
    }

    preload() {
        preloader.start(this);
        playerController.preload(this);
    }

    create() {
        this.scene.start("PixilTown");
    }

    update() {

    }
}