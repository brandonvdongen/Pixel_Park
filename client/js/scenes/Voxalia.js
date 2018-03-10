import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";
import * as playerController from "../modules/playerController.js";
import * as multiplayerController from "../modules/multiplayerController.js";

let player;
let map;

export class Voxalia extends Phaser.Scene {

    constructor() {
        super({key: 'Voxalia'});
    }

    preload() {
        console.log("loading map");
        preloader.start(this);
        //bgm
        this.load.audio("song_bitBossa", bgmSongList.song_bitBossa.src);
        //map
        this.load.image('Voxalia', 'assets/tiles/Voxalia.png');
        this.load.tilemapTiledJSON('Map_Voxalia', 'assets/tilemap/Voxalia.json');

    }

    create() {
        storage.activeScene = this;

        map = this.make.tilemap({key: 'Map_Voxalia'});
        const tileset = map.addTilesetImage('Voxalia');
        const ground_layer = map.createStaticLayer('Ground', tileset, 0, 0);
        const bridge_layer = map.createStaticLayer('Bridge', tileset, 0, 0);
        map.setLayer(ground_layer);
        ground_layer.setCollisionBetween(9, 11);
        ground_layer.setCollision(-1);
        ground_layer.setCollisionFromCollisionGroup();
        bridge_layer.setCollisionFromCollisionGroup();
        // this.physics.world.setBounds();


        storage.mainCamera = this.cameras.main;
        storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);
        storage.mainCamera.setZoom(3);

        this.sound.pauseOnBlur = false;
        playBGM(this, "song_bitBossa");

        const spawn = map.tileToWorldXY(2, 5, {}, storage.mainCamera, ground_layer);
        spawn.x -= map.tileWidth / 2;
        spawn.y -= map.tileHeight / 2;
        storage.sceneSpawn = spawn;
        storage.player = playerController.createPlayer(this, spawn, "#ffffff");
        this.physics.add.collider(storage.player.sprite, ground_layer);
        this.physics.add.collider(storage.player.sprite, bridge_layer);
        storage.cameraTarget = storage.player.sprite;


        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug = false;

    }

    update(time, delta) {
        smoothMoveCameraTowards(storage.cameraTarget, 0.9);
        player = storage.player.sprite;
        let controls = storage.controls;
        player.position = {x:player.x,y:player.y};
        playerController.move_player(player, controls, player.position);
        multiplayerController.update_multiplayers();
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