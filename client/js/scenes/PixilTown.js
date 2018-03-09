import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";

let controls;
let player;
var iter = 3.14;
export class TownPixil extends Phaser.Scene {

    constructor() {
        super({key: 'TownPixil'});
    }

    preload() {
        preloader.start(this);

        //bgm
        this.load.audio("song_witchesGetBitches", bgmSongList.song_witchesGetBitches.src);

        //map
        this.load.image('Tiles_PixilTown', 'assets/tiles/PixilTown.png');
        this.load.tilemapCSV('Map_PixilTown', 'assets/tilemap/PixilTown.csv');

        //player
        this.load.image('player', "assets/sprites/player.png")
    }

    create() {


        const map = this.make.tilemap({key: 'Map_PixilTown', tileWidth: 32, tileHeight: 32});
        const tileset = map.addTilesetImage('Tiles_PixilTown');
        const layer = map.createStaticLayer(0, tileset, 0, 0);

        storage.mainCamera = this.cameras.main;
        storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);

        // const cursors = this.input.keyboard.createCursorKeys();
        // const controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     speed: 0.5
        // };
        // controls = new Phaser.Cameras.Controls.Fixed(controlConfig);

        const help = this.add.text(16, 16, 'Help goes here', {
            fontSize: '18px',
            fill: '#ffffff'
        });

        help.setScrollFactor(0);

        this.sound.pauseOnBlur = false;
        playBGM(this, "song_witchesGetBitches");

        player = this.physics.add.sprite(16, 16, 'player');
        storage.mainCamera.startFollow(player);
        storage.mainCamera.setZoom(3);


    }

    update(time, delta) {
        // controls.update(delta);
        player.x = 250 + Math.cos(iter) * 200;
        player.y = 310 + Math.sin(iter) * 200;
        iter += 0.02;
    }

}