import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import * as playerController from "../modules/playerController.js";
import * as mapHandler from "../modules/mapHandler.js";
import * as cameraController from "../modules/cameraController.js";
import {storage} from "../data/storage.js";

let player;
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
        mapHandler.createMap(this, files);
    }

    update(time, delta) {
        mapHandler.updateMap(this);
    }

}