import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";
import {getKeyBind} from "../utility/keyBind.js";

let tileData = {
    pathways: [
        18, 19, 20, 21, 22, 23,
        27, 28, 29, 30, 31, 32,
        36, 37, 38, 39, 40
    ]
}

let controls = {
    up: 0,
    down: 0,
    left: 0,
    right: 0
};
let player;

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
        const ground_layer = map.createStaticLayer(0, tileset, 0, 0);
        const bridge_layer = map.createStaticLayer(0, tileset, 0, 0);

        map.setCollisionBetween(9, 11);
        map.setCollision(-1);

        storage.mainCamera = this.cameras.main;
        storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);

        const help = this.add.text(16, 16, 'Help goes here', {
            fontSize: '18px',
            fill: '#ffffff'
        });

        help.setScrollFactor(0);

        this.sound.pauseOnBlur = false;
        playBGM(this, "song_witchesGetBitches");

        player = this.physics.add.sprite(16, 16, 'player');
        player.setSize(10, 10);
        player.setOffset(3, 6);
        this.physics.add.collider(player, ground_layer);
        this.physics.add.collider(player, bridge_layer);
        player.setCollideWorldBounds(true);
        storage.mainCamera.startFollow(player);
        storage.mainCamera.setZoom(3);



        document.addEventListener("keydown", (ev) => {
            const button = getKeyBind(ev.code);
            if (!controls[button] && button !== undefined) {
                controls[button] = 1;
            }
        });

        document.addEventListener("keyup", (ev) => {
            const button = getKeyBind(ev.code);
            if (controls[button]) {
                controls[button] = 0;
            }
        });

    }

    update(time, delta) {
        if (controls) {
            if (controls.up) {
                player.setVelocityY(-100);
            } else if (controls.down) {
                player.setVelocityY(100);
            } else {
                player.setVelocityY(0);
            }

            if (controls.left) {
                player.setVelocityX(-100);
            } else if (controls.right) {
                player.setVelocityX(100);
            } else {
                player.setVelocityX(0);
            }
        }
        // console.clear();
        // console.log(player.physics);
    }

}