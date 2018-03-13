import * as preloader from "../utility/preloader.js";
import {storage} from "../data/storage.js";
import {bgmSongList} from "../data/songs.js";
import {connect} from "../modules/multiplayerController.js";
import * as playerController from "../modules/playerController.js";

export class MainMenu extends Phaser.Scene {

    constructor() {
        super({key: 'MainMenu'});
    }

    preload() {
        playerController.init()
        preloader.start(this);
        this.load.audio("song_nontindeVendorTheme", bgmSongList.song_nontindeVendorTheme.src);
        this.load.image('menu_main', 'assets/textures/hud/mainmenu.png');

        //player
        playerController.preload(this);
    }

    create() {
        connect(this).then((data) => {
            storage.playerID = data.id;
            this.scene.start(data.map);
        });

    }

    update() {

    }
}