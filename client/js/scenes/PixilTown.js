import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import {storage} from "../data/storage.js";
import * as playerController from "../modules/playerController.js";
import * as multiplayerController from "../modules/multiplayerController.js";
import * as mapHandler from "../modules/mapHandler.js";

let map;
const mapName = "PixilTown";
const files = {
    map: {
        name: mapName,
        src: "assets/tilemap/PixilTown.json",
        layers: [
            {name: "Ground", key: "Tiles_PixilTown"},
            {name: "Roof", key: "Tiles_PixilTown"}
        ]
    },
    images: {
        Tiles_PixilTown: "assets/tiles/PixilTown.png"
    },
    audio: {
        song_XinyueTheme: bgmSongList.song_XinyueTheme.src

    },
    transport: [
        {
            name: "Voxalia",
            position: {
                x: 21,
                y: 7
            },
            target: {
                map: "Voxalia",
                destination: "PixilTown"
            }
        }
    ]


};

export class PixilTown extends Phaser.Scene {

    constructor() {
        super({key: mapName});
    }

    preload() {
        preloader.start(this);
        mapHandler.preloadMap(this, files);
    }

    create() {
        map = mapHandler.createMap(this, files);
        storage.player = playerController.createPlayer(this, map, "#ffffff");
        storage.player.sprite.you = true;
        storage.cameraTarget = storage.player.sprite;
    }

    update(time, delta) {
        mapHandler.updateMap(this);
        multiplayerController.update_multiplayers();
    }

}