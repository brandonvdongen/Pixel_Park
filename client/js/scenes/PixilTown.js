import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";
import * as playerController from "../modules/playerController.js";
import * as mapHandler from "../modules/mapHandler.js";
import * as cameraController from "../modules/cameraController.js";
import {updatePlayerMovement} from "../modules/playerController.js";

let map;
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
        this.map = mapHandler.createMap(this, files);
        this.player = playerController.createPlayer(this, undefined, "#ffffff");
        this.player.you = true;
        cameraController.setCameraToWorldXY(this, this.player.sprite);
    }

    update(time, delta) {
        cameraController.smoothCamera(this, .9);
        mapHandler.updateMap(this);
        playerController.updatePlayerMovement(this,this.player.controls,this.player.sprite);
    }

}