import {getKeyBind} from "../utility/keyBind.js";
import {storage} from "../data/storage.js";

let started = false;


export function init() {
    if (!started) {
        const controls = storage.controls;
        document.addEventListener("keydown", (ev) => {
            const button = getKeyBind(ev.code);
            if (!controls[button] && button !== undefined) {
                controls[button] = 1;
                if (button === "interact") {
                    interact(getTileUnderPlayer(game));
                }
            }
        });

        document.addEventListener("keyup", (ev) => {
            const button = getKeyBind(ev.code);
            if (controls[button]) {
                controls[button] = 0;
            }
        });
        started = true;
    }
}

export function preload(game) {
    game.load.image('player', "assets/sprites/player.png");
    game.load.spritesheet('player_idle', "assets/sprites/player_idle.png", {frameWidth: 32, frameHeight: 32});
    game.load.spritesheet('player_hop', "assets/sprites/player_hop.png", {frameWidth: 32, frameHeight: 32});
    game.load.spritesheet('player_spawn', "assets/sprites/player_spawn.png", {frameWidth: 32, frameHeight: 32});

    game.load.on("complete", () => {
        game.anims.create({
            key: 'idle',
            frames: game.anims.generateFrameNumbers('player_idle', {start: 0, end: 2}),
            frameRate: 2,
            repeat: -1
        });
        game.anims.create({
            key: 'hop',
            frames: game.anims.generateFrameNumbers('player_hop', {start: 0, end: 6}),
            frameRate: 12,
            repeat: -1
        });
        game.anims.create({
            key: 'spawn',
            frames: game.anims.generateFrameNumbers('player_spawn', {start: 0, end: 14}),
            frameRate: 12,
            repeat: 0,
            onComplete: function (player) {
                console.log("player spawned");
                player.anims.play('idle');
                const index = player.moveBlock.indexOf("animation_spawn");
                if (index > -1) player.moveBlock.splice(index, 1);
            }
        });
        game.anims.create({
            key: 'delete',
            frames: game.anims.generateFrameNumbers('player_spawn', {frames: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]}),
            frameRate: 12,
            repeat: 0,
            onComplete: function (player) {
                player.destroy();
            }
        });
    });
}


export function createPlayer(game, position, color) {
    if (position === undefined) position = game.map.spawn;
    const player = new PlayerController(game, position, color);
    game.map.layers.forEach((layer) => {
        game.physics.add.collider(player.sprite, layer.tilemapLayer);
    });
    player.sprite.moveBlock.push("animation_spawn");
    player.sprite.anims.play("spawn", true);

    return player;
}

export function updatePlayerMovement(game, player, controls, target) {
    let walking = false;
    player = player.sprite;
    // const player = game.player.sprite;
    const speed = player.speed;
    const position = player.position;
    console.log(controls);
    if (controls && player && player.moveBlock.length <= 0) {
        if (controls.up) {
            player.setVelocityY(-speed);
            walking = true;
        } else if (controls.down) {
            player.setVelocityY(speed);
            walking = true;
        } else {
            player.setVelocityY(0);
        }
        if (controls.left) {
            player.setVelocityX(-speed);
            walking = true;
        } else if (controls.right) {
            player.setVelocityX(speed);
            walking = true;
        } else {
            player.setVelocityX(0);
        }
        if (walking) {
            player.anims.play('hop', true);
            player.walking = true;
        }
        else if (player.walking === true) {
            player.anims.play('idle', true);
            player.walking = false;
            if (target && !player.you) player.setPosition(target.x, target.y);
        }
        if (position) {
            const map = game.map;
            const tileXY = map.worldToTileXY(position.x, position.y);
            const worldXY = map.tileToWorldXY(tileXY.x, tileXY.y);
            const smoothFactor = 0.1;
            map.layers.forEach((layer) => {
                map.setLayer(layer.name);
                const tile = map.getTileAt(tileXY.x, tileXY.y);
                if (tile) {
                    if (tile.properties.speed) {
                        player.speed = tile.properties.speed;
                    } else {
                        player.speed = player.defaultSpeed;
                    }
                    if (!walking && tile.properties.align === true) {
                        const target = {
                            x: ((position.x - worldXY.x - (layer.baseTileWidth / 2)) * smoothFactor),
                            y: ((position.y - worldXY.y - (layer.baseTileHeight / 2)) * smoothFactor)
                        };
                        player.setPosition(position.x - target.x, position.y - target.y);
                    }
                }
            });
        }
        if (player.position) player.depth = player.position.y;
    }
}

export function getTileUnderPlayer(game) {
    const tileData = {};
    const map = game.map;
    const tileXY = map.worldToTileXY(game.player.sprite.x, game.player.sprite.y);
    map.layers.forEach((layer) => {
        map.setLayer(layer.name);
        const tile = map.getTileAt(tileXY.x, tileXY.y);
        if (tile) {
            Object.assign(tileData, tile);
        }
    });
    return tileData;
}

export function interact(tile) {
    if (tile.properties.teleporter) {
        console.log("woosh@", tile.properties.map, ":", tile.properties.destination);
    }
}

class PlayerController {
    constructor(game, position, color = "#ffffff") {
        this.color = color;
        this.sprite = game.physics.add.sprite(16, 16, 'player');
        this.sprite.setSize(10, 10);
        this.sprite.setOffset(11, 11);
        this.sprite.setPosition(position.x, position.y);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0);
        this.sprite.moveBlock = [];
        this.sprite.defaultSpeed = 100;
        this.sprite.speed = 100;
        this.sprite.position = position;
    }
}