import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";

export class TownPixil extends Phaser.Scene {

    constructor() {
        super({key: 'TownPixil'});
    }

    preload() {
        let filesToLoad = 13;
        let filesLoaded = 0;

        //todo replace preloader once preload rendering is fixed
        const preloader = document.createElement("div");
        const text = document.createElement("div");
        const progress = document.createElement("div");

        preloader.classList.add("preloader");
        progress.classList.add("progress");
        text.classList.add("text");

        preloader.appendChild(progress);
        preloader.appendChild(text);
        document.body.appendChild(preloader);

        const loading = {};
        this.load.on('fileprogress', function (file, value) {
            filesToLoad = this.load.totalToLoad;
            let status_text;
            let totalProgress = 0;
            loading[file.key] = value;

            for (const key in loading) {
                status_text = "Downloading (" + (filesLoaded + 1) + "/" + filesToLoad + ") " + key + ":" + Math.round(loading[key] * 100) + "%";
                totalProgress += loading[key];
                progress.style.width = 800 * (totalProgress / filesToLoad) + "px";
            }

            text.innerText = status_text;
            if (totalProgress / filesToLoad === 1) text.innerText = "Loading Game...";

            if (value === 1) filesLoaded++;
        }.bind(this));

        this.load.maxParallelDownloads = 1;
        this.load.on('complete', function () {
            preloader.classList.add("done");
            preloader.addEventListener("transitionend", handler = function(e){
                e.target.removeEventListener(e.type,handler);
                preloader.parentNode.removeChild(preloader);
            });
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