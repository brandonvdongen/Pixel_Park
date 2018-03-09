import * as preloader from "../utility/preloader.js";
import {storage} from "../data/storage.js";
import {playBGM,randomSongKey} from "../functions/functions.js";

export class MainMenu extends Phaser.Scene {

    constructor() {
        super({key: 'MainMenu'});
    }

    preload() {
        preloader.start(this);

        // for (const song in bgmSongList) {
        //     if (bgmSongList.hasOwnProperty(song)) {
        //         this.load.audio(song, bgmSongList[song].src);
        //     }
        // }

        this.load.audio("song_XinyueTheme", "assets/music/The_J_Arthur_Keenes_Band_-_01_-_Xinyue_Theme_1.ogg");
        this.load.image('menu_main', 'assets/textures/hud/mainmenu.png');
    }

    create() {

        this.menu = this.add.image(400, 300, 'menu_main');
        Phaser.Display.Align.In.Center(this.menu, this.add.zone(400, 300, storage.settings.resolution.width, storage.settings.resolution.height));

        this.sound.pauseOnBlur = false;
        playBGM(this, "song_XinyueTheme");

        this.input.once('pointerdown', function (event) {
            this.scene.start('TownPixil');
        }, this);

    }

    update() {

    }
}