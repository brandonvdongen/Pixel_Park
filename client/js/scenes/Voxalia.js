import * as mapController from "../modules/mapController.js";
import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";

const config = {
    map: {
        name: "Voxalia",
        src: "assets/tilemap/Voxalia.json",
        layers: [
            {name: "Ground", key: "Tiles_Voxalia"},
            {name: "Roof", key: "Tiles_Voxalia"}
        ]
    },
    images: {
        Tiles_Voxalia: "assets/tiles/Voxalia.png"
    },
    audio: {
        song_XinyueTheme: bgmSongList.song_XinyueTheme.src

    },
    transport: [
        {
            name: "PixilTown",
            layer: 'Ground',
            position: {
                x: 4,
                y: 4
            },
            target: {
                map: "PixilTown",
                destination: "Voxalia"
            }
        }
    ]


};

export class Voxalia extends Phaser.Scene {
    constructor() {
        super({key: config.map.name});
    }

    preload() {
        preloader.start(this);
        mapController.preload(this, config);
    }

    create() {
        mapController.create(this, config);
    }

    update(time, delta) {
        mapController.update(this, config);
    }

}