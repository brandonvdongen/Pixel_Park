import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";
import * as preloader from "../utility/preloader.js";

export class TownPixil extends Phaser.Scene {

    constructor() {
        super({key: 'TownPixil'});
    }

    preload() {
        let filesToLoad;
        let filesLoaded = 0;

        //todo replace preloader once preload rendering is fixed
        preloader.start();

        const loading = {};
        this.load.on('fileprogress', function (file, value) {
            filesToLoad = this.load.totalToLoad;
            preloader.update(file, value, loading, filesToLoad);
        }.bind(this));

        this.load.maxParallelDownloads = 1;
        this.load.on('complete', function () {
            preloader.done();
        });

        this.load.audio("song_witchesGetBitches", bgmSongList.song_witchesGetBitches.src);
        this.load.image('sky', 'assets/textures/world/sky.png');
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