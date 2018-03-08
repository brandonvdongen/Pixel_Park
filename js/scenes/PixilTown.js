import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";

export class TownPixil extends Phaser.Scene {

    constructor() {
        super({key: 'TownPixil'});
    }

    preload() {
        //todo replace preloader once preload rendering is fixed
        preloader.start(this);

        this.load.audio("song_witchesGetBitches", bgmSongList.song_witchesGetBitches.src);
        // this.load.image('sky', 'assets/textures/world/sky.png');
        this.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
        this.load.tilemapCSV('map', 'assets/tilemap/PixilTown.csv');
    }

    create() {

        this.menu = this.add.image(400, 300, 'sky');
        Phaser.Display.Align.In.Center(this.menu, this.add.zone(400, 300, storage.settings.resolution.width, storage.settings.resolution.height));

        this.sound.pauseOnBlur = false;
        playBGM(this, "song_witchesGetBitches");

    }

    update() {

    }
}