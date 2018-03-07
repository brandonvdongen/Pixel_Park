import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";

export class MainMenu extends Phaser.Scene {

    constructor() {
        super({key: 'MainMenu'});
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
            preloader.addEventListener("transitionend", () => {
                preloader.removeEventListener("transitionend");
                preloader.parentNode.removeChild(preloader);
            });
        });


        // for (const song in bgmSongList) {
        //     if (bgmSongList.hasOwnProperty(song)) {
        //         this.load.audio(song, bgmSongList[song].src);
        //     }
        // }

        this.load.audio("song_bitBossa", bgmSongList.song_bitBossa.src);
        this.load.image('menu_main', 'assets/textures/hud/mainmenu.png');
    }

    create() {

        this.menu = this.add.image(400, 300, 'menu_main');
        Phaser.Display.Align.In.Center(this.menu, this.add.zone(400, 300, storage.settings.resolution.width, storage.settings.resolution.height));

        this.sound.pauseOnBlur = false;
        playBGM(this, "song_bitBossa");

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