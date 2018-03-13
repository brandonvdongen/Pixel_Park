import * as debug from "../utility/debugger.js";
import * as cameraController from "./cameraController.js";
import * as playerController from "./playerController.js";
import {storage} from "../data/storage.js";

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
    console.log("installing plugins");
    game.sys.install('AnimatedTiles');

    console.log("setting up camera");
    const camera = game.cameras.main;
    camera.setViewport(0, 0, window.innerWidth, window.innerHeight);
    camera.setZoom(3);

    console.log("creating map");
    const map = game.make.tilemap({key: files.map.name});
    game.map = map;
    files.map.layers.forEach((layer, index) => {
        const tileset = map.addTilesetImage(layer.key);
        let dynamicLayer = map.createDynamicLayer(layer.name, tileset, 0, 0);
        dynamicLayer.setCollisionByProperty({collides: true});
        if (index === 0) dynamicLayer.depth = 0;
        else dynamicLayer.depth = 1000;

    });
    const layer = map.getLayer("Ground");
    console.log("getting tile data");
    map.getTilesWithin(0, 0, layer.width, layer.height, {}, layer.tilemapLayer).forEach((tile, index) => {
        if (tile.properties) {
            if (tile.properties["spawn"]) {
                console.log("found spawn");
                map.spawn = map.tileToWorldXY(tile.x + 1, tile.y + 1, {}, camera, layer.tilemapLayer);
                map.spawn.x -= map.tileWidth / 2;
                map.spawn.y -= map.tileHeight / 2;
            }
            if (tile.properties["teleporter"] === true) {
                let found = false;
                files.transport.forEach(teleporter => {
                    if (teleporter.position.x === tile.x && teleporter.position.y === tile.y) {
                        found = true;
                        console.log("found transporter:", teleporter.name);
                        tile.properties.map = teleporter.target.map;
                        tile.properties.destination = teleporter.target.destination;
                        if (!map.teleporters) map.teleporters = {};
                        map.teleporters[teleporter.name] = teleporter;
                    }
                    if (!found) {
                        console.warn("transport ", teleporter, "configured, but no teleporter tile found at specified position");
                    }
                });
            }
        }
    });

    game.sys.animatedTiles.init(map);
    console.log("map loaded");
    game.map = map;
    storage.game = game;
    game.player = playerController.createPlayer(game, undefined, "#ffffff");
    game.player.you = true;
    cameraController.setCameraToWorldXY(game, game.player.sprite);
}

export function updateMap(game) {
    debug.propertyCursor(game);
    cameraController.smoothCamera(game, .9);
    playerController.updatePlayerMovement(game, game.player, storage.controls, game.player.sprite);
    // smoothMoveCameraTowards(storage.cameraTarget, 0.9);
    // const player = storage.player.sprite;
    // let controls = storage.controls;
    // player.position = {x: player.x, y: player.y};
    // playerController.move_player(player, controls, player.position);
}