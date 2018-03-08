import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM,randomSongKey} from "../functions/functions.js";

export class MainMenu extends Phaser.Scene {

    constructor() {
        super({key: 'MainMenu'});
    }

    preload() {
        preloader.start(this);

        for (const song in bgmSongList) {
            if (bgmSongList.hasOwnProperty(song)) {
                this.load.audio(song, bgmSongList[song].src);
            }
        }
        this.load.image('menu_main', 'assets/textures/hud/mainmenu.png');
    }

    create() {

        this.menu = this.add.image(400, 300, 'menu_main');
        Phaser.Display.Align.In.Center(this.menu, this.add.zone(400, 300, storage.settings.resolution.width, storage.settings.resolution.height));

        this.sound.pauseOnBlur = false;
        playBGM(this, randomSongKey());

        this.input.once('pointerdown', function (event) {

            console.log('Changing to Pixil');

            const pixil = this.scene.start('TownPixil');
            setTimeout(() => {
                pixil.destroy();
            }, 3000);

        }, this);

    }

    update() {

    }
}