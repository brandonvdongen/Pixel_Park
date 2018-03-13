import * as preloader from "../utility/preloader.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";
import {bgmSongList} from "../data/songs.js";
import {connect} from "../modules/multiplayerController.js";
import * as playerController from "../modules/playerController.js";

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

        this.load.audio("song_nontindeVendorTheme", bgmSongList.song_nontindeVendorTheme.src);
        this.load.image('menu_main', 'assets/textures/hud/mainmenu.png');

        //player
        playerController.preload(this);
    }

    create() {
        storage.activeScene=this;

        // this.menu = this.add.image(400, 300, 'menu_main');
        // Phaser.Display.Align.In.Center(this.menu, this.add.zone(window.innerWidth / 2, window.innerHeight / 2, storage.settings.resolution.width, storage.settings.resolution.height));
        // this.menu.setScale(2);

        this.sound.pauseOnBlur = false;
        // playBGM(this, "song_nontindeVendorTheme");

        // this.input.once('pointerdown', function (event) {
        console.log("starting")
            this.scene.start('PixilTown');
        // }, this);

        // connect(this).then((data) => {
        //     storage.player.id = data.id;
        //     this.scene.start(data.map);
        //     // this.scene.start('Voxalia');
        // });

    }

    update() {

    }
}