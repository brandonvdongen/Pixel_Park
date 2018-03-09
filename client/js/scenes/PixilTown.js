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
let map;

export class TownPixil extends Phaser.Scene {

    constructor() {
        super({key: 'TownPixil'});
    }

    preload() {
        preloader.start(this);

        //bgm
        this.load.audio("song_witchesGetBitches", bgmSongList.song_witchesGetBitches.src);

        //map
        this.load.image('PixilTown', 'assets/tiles/PixilTown.png');
        this.load.tilemapTiledJSON('Map_PixilTown', 'assets/tilemap/PixilTown.json');

        //player
        this.load.image('player', "assets/sprites/player.png")
    }

    create() {


        map = this.make.tilemap({key: 'Map_PixilTown'});
        const tileset = map.addTilesetImage('PixilTown');
        const ground_layer = map.createStaticLayer('Ground', tileset, 0, 0);
        const bridge_layer = map.createStaticLayer('Bridge', tileset, 0, 0);
        map.setLayer(ground_layer);
        // ground_layer.setCollisionBetween(9, 11);
        ground_layer.setCollision(-1);
        // bridge_layer.setLayer(bridge_layer);
        ground_layer.setCollisionFromCollisionGroup();
        bridge_layer.setCollisionFromCollisionGroup();
        // bridge_layer.setCollisionByExclusion([-1]);
        this.matter.world.convertTilemapLayer(ground_layer);
        this.matter.world.convertTilemapLayer(bridge_layer);
        this.matter.world.setBounds();


        storage.mainCamera = this.cameras.main;
        storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);

        const help = this.add.text(16, 16, 'Help goes here', {
            fontSize: '18px',
            fill: '#ffffff'
        });

        help.setScrollFactor(0);

        this.sound.pauseOnBlur = false;
        playBGM(this, "song_witchesGetBitches");

        player = this.matter.add.sprite(16, 16, 'player');
        player.setBody({type: 'circle', radius: 5, width: 10, height: 10});
        player.setFixedRotation();
        player.body.position.y -= 3;
        // player.setOffset(3, 6);
        // this.matter.add.collider(player, ground_layer);
        // this.matter.add.collider(player, bridge_layer);
        // player.setCollideWorldBounds(true);
        storage.cameraTarget = player;
        // storage.mainCamera.startFollow(player);
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
        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug = false;

    }

    update(time, delta) {
        if (controls) {
            if (controls.up) {
                player.setVelocityY(-1);
            } else if (controls.down) {
                player.setVelocityY(1);
            } else {
                player.setVelocityY(0);
            }

            if (controls.left) {
                player.setVelocityX(-1);
            } else if (controls.right) {
                player.setVelocityX(1);
            } else {
                player.setVelocityX(0);
            }
        }
        // console.clear();
        // console.log(player.physics);
        smoothMoveCameraTowards(storage.cameraTarget, 0.9);
    }

}


function smoothMoveCameraTowards(target, smoothFactor) {
    if (target) {
        if (smoothFactor === undefined) {
            smoothFactor = 0;
        }
        storage.mainCamera.scrollX = smoothFactor * storage.mainCamera.scrollX + (1 - smoothFactor) * (target.x - storage.mainCamera.width * 0.5);
        storage.mainCamera.scrollY = smoothFactor * storage.mainCamera.scrollY + (1 - smoothFactor) * (target.y - storage.mainCamera.height * 0.5);
    }
}