import {storage} from "../data/storage.js";
import * as debug from "../utility/debugger.js";
import * as playerController from "./playerController.js";
import {smoothMoveCameraTowards} from "../utility/cameraSmooth.js";

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
    console.log("loading plugins");
    game.load.plugin('AnimatedTiles', './plugins/AnimatedTiles.min.js');
    console.log("loading map");
    if (files.map) process(game, files.map, "load_map");
    if (files.images) process(game, files.images, "load_image");
    if (files.audio) process(game, files.audio, "load_audio");
}

export function createMap(game, files) {
    storage.activeScene = game;
    console.log("installing plugins");
    game.sys.install('AnimatedTiles');


    console.log("setting up camera");
    storage.mainCamera = game.cameras.main;
    storage.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight);
    storage.mainCamera.setZoom(3);

    console.log("creating map");
    map = game.make.tilemap({key: files.map.name});
    files.map.layers.forEach((layer, index) => {
        const tileset = map.addTilesetImage(layer.key);
        layers[layer.name] = map.createDynamicLayer(layer.name, tileset, 0, 0);
        layers[layer.name].setCollisionByProperty({collides: true});
        if (index === 0) layers[layer.name].depth = 0;
        else layers[layer.name].depth = 1000;

    });
    const layer = layers["Ground"];
    console.log("getting tile data");
    map.getTilesWithin(0, 0, layer.width, layer.height, {}, layer).forEach((tile, index) => {
        if (tile.properties) {
            if (tile.properties.spawn) {
                console.log("found spawn");
                map.spawn = map.tileToWorldXY(tile.x + 1, tile.y + 1, {}, storage.mainCamera, layer);
                map.spawn.x -= map.tileWidth / 2;
                map.spawn.y -= map.tileHeight / 2;
            }
            if (tile.properties.teleporter === true) {
                let found = false;
                files.transport.forEach(teleporter => {
                    if (teleporter.position.x === tile.x && teleporter.position.y === tile.y) {
                        found = true;
                        console.log("found: ", teleporter.name);
                        tile.properties.map = teleporter.target.map;
                        tile.properties.destination = teleporter.target.destination;
                    }
                    if (!found) {
                        console.warn("transport ", teleporter, "configured, but no teleporter tile found at specified position");
                    }
                })

                // map.teleporters.push(value);
            }
        }
    });



    storage.activeScene = map;
    console.log("map loaded");
    game.sys.animatedTiles.init(map);
    return map;
}

export function updateMap(game) {
    debug.propertyCursor(game, map);
    smoothMoveCameraTowards(storage.cameraTarget, 0.9);
    const player = storage.player.sprite;
    let controls = storage.controls;
    player.position = {x: player.x, y: player.y};
    playerController.move_player(player, controls, player.position);
}