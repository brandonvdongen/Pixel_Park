import {getKeyBind} from "../utility/keyBind.js";
import {storage} from "../data/storage.js";
import * as multiplayerController from "../modules/multiplayerController.js";
import {smoothMoveCameraTowards} from "../utility/cameraSmooth.js";

let started = false;


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
                console.log(storage);
                player.anims.play('idle');
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
        let controls = storage.controls;
        if (!started) {
            document.addEventListener("keydown", (ev) => {
                const button = getKeyBind(ev.code);
                if (!controls[button] && button !== undefined) {
                    controls[button] = 1;
                    multiplayerController.update();
                }
            });

            document.addEventListener("keyup", (ev) => {
                const button = getKeyBind(ev.code);
                if (controls[button]) {
                    controls[button] = 0;
                    multiplayerController.update();
                }
            });
            started = true;
        }
    });
}


export function move_player(player, controls, position) {
    let walking = false;
    // if (position) player.setPosition(position.x, position.y);
    if (controls && player) {
        if (controls.up) {
            player.setVelocityY(-100);
            walking = true;
        } else if (controls.down) {
            player.setVelocityY(100);
            walking = true;
        } else {
            player.setVelocityY(0);
        }
        if (controls.left) {
            player.setVelocityX(-100);
            walking = true;
        } else if (controls.right) {
            player.setVelocityX(100);
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
            if (position) player.setPosition(position.x, position.y);
        }
        if (!walking && position) {
            const map = storage.activeScene;
            const layer = map.getLayer("Ground");
            const tileXY = map.worldToTileXY(position.x, position.y);
            const worldXY = map.tileToWorldXY(tileXY.x, tileXY.y);
            const smoothFactor = 0.1;
            if (!player.you) {
                const target = {
                    x: ((position.x - worldXY.x - (layer.baseTileWidth / 2)) * smoothFactor),
                    y: ((position.y - worldXY.y - (layer.baseTileHeight / 2)) * smoothFactor)
                };
                if ((Math.abs(target.x) > 0.001 || Math.abs(target.y) > 0.001)) {
                    player.setPosition(position.x - target.x, position.y - target.y);
                }
            }
            // if (player.you) {
            //     if (!player.lastTile) player.lastTile = {x: -1, y: -1};
            //     if (player.lastTile.x !== tileXY.x || player.lastTile.y !== tileXY.y) {
            //         player.lastTile.x = tileXY.x;
            //         player.lastTile.y = tileXY.y;
            //         map.layers.forEach((layer) => {
            //             map.setLayer(layer.name);
            //             const tile = map.getTileAt(tileXY.x, tileXY.y);
            //             if (tile) {
            //                 if (tile.properties) {
            //                     console.log(player.interacting);
            //                     if (controls.interact && !player.interacting) {
            //                         player.interact = true;
            //                         interact(tile);
            //
            //                     } else if (!controls.interact && player.interacting) {
            //                         player.interacting = false;
            //                     }
            //                 }
            //             }
            //         });
            //     }
            // }

        }
        if (player.position) player.depth = player.position.y;
        storage.player.controls = controls;
        storage.player.position = player.position;
    }
}

export function createPlayer(game, map, color) {
    const player = new PlayerController(game, map, color);
    let controls = storage.controls;
    move_player(player.sprite, controls, player.sprite.position);
    smoothMoveCameraTowards(storage.cameraTarget, 0);
    player.sprite.anims.play("spawn", true);
    return player;
}

export function interact(tile) {
    console.log(tile);
}

class PlayerController {
    constructor(game, map = {spawn: {x: 100, y: 100}}, color = "#ffffff") {
        this.id = storage.player.id;
        this.color = color;
        this.sprite = game.physics.add.sprite(16, 16, 'player');
        this.sprite.setSize(10, 10);
        this.sprite.setOffset(11, 14);
        console.log(map);
        this.sprite.setPosition(map.spawn.x, map.spawn.y);
        // if(map.destination)this.sprite.setPosition(map.destination.x, map.destination.y);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0);
        map.layers.forEach((layer) => {
            game.physics.add.collider(this.sprite, layer.tilemapLayer);
        });
        this.position = map.spawn;
        this.controls = {
            up: 0,
            down: 0,
            left: 0,
            right: 0
        }
    }
}