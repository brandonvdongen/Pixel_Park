import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import {playBGM} from "../functions/functions.js";
import * as playerController from "../modules/playerController.js";
import * as multiplayerController from "../modules/multiplayerController.js";
import * as mapHandler from "../modules/mapHandler.js";
import * as debug from "../utility/debugger.js";

let player;
let map;
const mapName = "Map_PixilTown";
const files = {
    map: {
        name: mapName,
        src: "assets/tilemap/PixilTown.json",
        layers: [
            {name: "Ground", key: "Tiles_PixilTown"},
            {name: "Bridge", key: "Tiles_PixilTown"}
        ]
    },
    images: {
        Tiles_PixilTown: "assets/tiles/PixilTown.png"
    },
    audio: {
        song_XinyueTheme: bgmSongList.song_XinyueTheme.src

    }
};

export class PixilTown extends Phaser.Scene {

    constructor() {
        super({key: 'PixilTown'});
    }

    preload() {
        preloader.start(this);
        mapHandler.preloadMap(this, files);
    }

    create() {
        storage.activeScene = this;

        // map = this.make.tilemap({key: 'Map_PixilTown'});
        // console.log(map.layers);
        // const tileset = map.addTilesetImage('Tiles_PixilTown');
        // const ground_layer = map.createStaticLayer('Ground', tileset, 0, 0);
        // const bridge_layer = map.createStaticLayer('Bridge', tileset, 0, 0);
        // map.setLayer(ground_layer);
        // ground_layer.setCollisionBetween(9, 11);
        // ground_layer.setCollision(-1);
        // ground_layer.setCollisionFromCollisionGroup();
        // bridge_layer.setCollisionFromCollisionGroup();

        map = mapHandler.createMap(this, files);
        // this.sound.pauseOnBlur = false;
        // playBGM(this, "song_XinyueTheme");

        map.spawn.x -= map.tileWidth / 2;
        map.spawn.y -= map.tileHeight / 2;
        storage.sceneSpawn = map;
        storage.player = playerController.createPlayer(this, map, "#ffffff");
        // mapHandler.setCollision(this, storage.player);
        // this.physics.add.collider(storage.player.sprite, ground_layer);
        // this.physics.add.collider(storage.player.sprite, bridge_layer);
        storage.cameraTarget = storage.player.sprite;
        map.setLayer('Ground');
        console.log(map.layer);
        // debug.drawDebug(this, map);
    }

    update(time, delta) {
        debug.propertyCursor(this, map);
        smoothMoveCameraTowards(storage.cameraTarget, 0.9);
        player = storage.player.sprite;
        let controls = storage.controls;
        player.position = {x: player.x, y: player.y};
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