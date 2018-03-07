import {playBGM} from "./functions/playBGM.js";
import {bgmSongList} from "./data/songs.js";

let game;


document.addEventListener("DOMContentLoaded", () => {

    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 300},
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        audio: {
            pauseOnBlur: false
        }
    };

    game = new Phaser.Game(config);

    function preload() {
        const game = this;
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
        //todo replace preloader once preload rendering is fixed

        const loading = {};
        this.load.on('fileprogress', function (file, value) {
            filesToLoad = game.load.totalToLoad;
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
        });

        this.load.maxParallelDownloads = 1;
        this.load.on('complete', function () {
            document.body.removeChild(preloader);
        });


        // for (const song in bgmSongList) {
        //     if (bgmSongList.hasOwnProperty(song)) {
        //         this.load.audio(song, bgmSongList[song].src);
        //     }
        // }

        this.load.audio("song_bitBossa", bgmSongList.song_bitBossa.src);

        this.load.image('sky', 'assets/textures/world/sky.png');
        this.load.image('ground', 'assets/textures/world/platform.png');
        this.load.image('star', 'assets/textures/sprites/star.png');
        this.load.image('bomb', 'assets/textures/sprites/bomb.png');
        this.load.spritesheet('dude',
            'assets/textures/sprites/dude.png',
            {frameWidth: 32, frameHeight: 48}
        );
        this.load.spritesheet('dude2',
            'assets/textures/sprites/dude2.png',
            {frameWidth: 32, frameHeight: 48}
        );


    }

    function create() {
        game.sound.pauseOnBlur = false;
        playBGM(game, "song_bitBossa");


    }

    function update() {

    }

});