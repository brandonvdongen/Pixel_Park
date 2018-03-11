import {storage} from "../data/storage.js";

let map;
const tilesets = {};
const layers = {};

function process(game, files, type) {
    if (type === "load_map") {
        game.load.tilemapTiledJSON(files.name, files.src);
    }
    else {
        for (const file in files) {
            if (files.hasOwnProperty(file)) {
                if (type === "load_image") game.load.image(file, files[file]);
                else if (type === "load_audio") game.load.audio(file, files[file]);
            }
        }
    }
}

export function preloadMap(game, files) {
    console.log("loading map");
    if (files.map) process(game, files.map, "load_map");
    if (files.images) process(game, files.images, "load_image");
    if (files.audio) process(game, files.audio, "load_audio");
}

export function createMap(game, files) {
    console.log("setting up camera");
    storage.mainCamera = game.cameras.main;
    storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);
    storage.mainCamera.setZoom(3);

    console.log("creating map");
    map = game.make.tilemap({key: files.map.name});
    files.map.layers.forEach((layer, index) => {
        const tileset = map.addTilesetImage(layer.key);
        layers[layer.name] = map.createStaticLayer(layer.name, tileset, 0, 0);
        // layers[layer.name].setCollisionBetween(9, 11);
        // layers[layer.name].setCollision(-1);
        layers[layer.name].setCollisionByProperty({collides: true});
        if(index===0)layers[layer.name].depth = 0;
        else layers[layer.name].depth = 1000;
        // layers[layer.name].getTilesWithin(0, 0, layers[layer.name].width, layers[layer.name].height, null, layers[layer.name]).forEach((value, index2) => {
        //    console.log(value,value.y);
        // });
    });

    map.spawn = map.tileToWorldXY(2, 5, {}, storage.mainCamera, layers["Ground"]);
    return map;
}

export function setCollision(game, sprite) {
    for (const layer in layers) {
        game.physics.add.collider(sprite, layer);
    }

}