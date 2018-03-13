import * as mapController from "../modules/mapController.js";
import * as preloader from "../utility/preloader.js";
import {bgmSongList} from "../data/songs.js";

const config = {
    map: {
        name: "PixilTown",
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
            layer: 'Ground',
            position: {
                x: 13,
                y: 15
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