import {config} from "../data/config.js";
import * as playerController from "./playerController.js";
import * as cameraController from "./cameraController.js";
import * as multiplayerController from "./multiplayerController.js";

const debug = config.debug;

function process(game, config, type) {
    if (type === "load_map") {
        game.load.tilemapTiledJSON(config.name, config.src);
    }
    else {
        for (const file in config) {
            if (config.hasOwnProperty(file)) {
                if (type === "load_image") game.load.image(file, config[file]);
                else if (type === "load_audio") game.load.audio(file, config[file]);
            }
        }
    }
}

export function preload(game, config) {
    multiplayerController.setScene(game);

    if (debug) console.log("***START PRELOADING MAP***");

    if (debug) console.log("Loading plugins");
    game.load.plugin('AnimatedTiles', './plugins/AnimatedTiles.min.js');

    if (debug) console.log("Processing map");
    if (config.map) process(game, config.map, "load_map");

    if (debug) console.log("loading images");
    if (config.images) process(game, config.images, "load_image");

    if (debug) console.log("loading audio");
    if (config.audio) process(game, config.audio, "load_audio");


    if (debug) console.log("***END PRELOADING MAP***");
}

export function create(game, config) {
    if (debug) console.log("***START CREATING MAP***");

    if (debug) console.log("Installing plugins");
    game.sys.install('AnimatedTiles');

    if (debug) console.log("Creating map");
    const map = game.make.tilemap({key: config.map.name});
    game.map = map;

    if (debug) console.log("Processing layers");
    config.map.layers.forEach((layer, index) => {
        const tileset = map.addTilesetImage(layer.key);
        const dynamicLayer = map.createDynamicLayer(layer.name, tileset, 0, 0);
        dynamicLayer.setCollisionByProperty({collides: true});
        dynamicLayer.depth = index * 1000;
    });

    if (debug) console.log("Processing tiles:");
    config.transport.forEach(transport => {
        if (debug) console.log("    ", transport.name, ">", transport.target.destination, "@", transport.target.map);
        const layer = map.getLayer(transport.layer);
        const position = transport.position;
        const tile = layer.data[position.x][position.y];
        tile.properties.name = transport.name;
        tile.properties.map = transport.target.map;
        tile.properties.destination = transport.target.destination;
    });

    const layer = map.getLayer('Ground');
    if (!game.map['spawn']) {
        for (let row of layer.data) {
            for (let tile of row) {
                if (tile.properties['spawn']) {
                    const position = map.tileToWorldXY(tile.x, tile.y, {}, game.cameras.main, layer.tilemapLayer);
                    if (debug) console.log("    ", "Found spawn at", tile.x, tile.y, position.x, position.y);
                    game.map.spawn = {x: position.x + map.tileWidth / 2, y: position.y + map.tileWidth / 2};
                }
            }
        }
    }
    if (debug) console.log("***END CREATING MAP***");

    if (debug) console.log("***START CREATE PLAYER***");
    if (debug) console.log("Creating character");
    const player = playerController.create(game, game.map.spawn, "player");
    playerController.setPlayerID("player");
    game.sys.animatedTiles.init(game.map);
    if (debug) console.log("Setting up camera");
    game.cameras.main.setZoom(3);
    cameraController.setTarget(player);
    cameraController.setCameraPosition(game, player);
    if (debug) console.log("***END CREATE PLAYER***");
    player.anims.play("spawn");
}

export function update(game, config) {
    cameraController.update(game);
    playerController.update(game);
}