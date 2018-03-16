import * as inputController from "./inputController.js";

let playerID;
const characters = {};


export function setPlayerID(id) {
    playerID = id;
    inputController.init(playerID, characters);
}

export function preload(game) {
    game.characters = characters;
    game.load.image('player', "assets/sprites/player/player.png");
    game.load.spritesheet('player_idle', "assets/sprites/player/player_idle.png", {frameWidth: 32, frameHeight: 32});
    game.load.spritesheet('player_hop', "assets/sprites/player/player_hop.png", {frameWidth: 32, frameHeight: 32});
    game.load.spritesheet('player_spawn', "assets/sprites/player/player_spawn.png", {frameWidth: 32, frameHeight: 32});

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
                delete characters[player.id];
                player.destroy();
                console.log(characters);
            }
        });
    });
}

export function create(game, position, id) {
    let sprite;
    sprite = game.physics.add.sprite(16, 16, 'player');
    sprite.setSize(10, 10);
    sprite.setOffset(11, 11);
    sprite.setPosition(position.x, position.y);
    sprite.setCollideWorldBounds(true);
    sprite.setBounce(0);
    sprite.moveBlock = ["animation_spawn"];
    sprite.defaultSpeed = 100;
    sprite.speed = 100;
    sprite.position = position;
    sprite.id = id;
    characters[id] = sprite;

    game.physics.add.collider(sprite, game.map.getLayer('Ground').tilemapLayer);

    sprite.on("interact", (game, sprite) => {
        interact(game, sprite);
    });

    return sprite;
}

export function update(game, config) {
    for (const id in characters) {
        if (characters.hasOwnProperty(id)) {
            let walking = false;
            let interacting = false;
            const player = characters[id];
            const speed = player.speed;
            if (player.controls && player.moveBlock.length <= 0) {
                const controls = player.controls;
                if (controls.up) {
                    player.setVelocityY(-speed);
                    walking = true;
                }
                else if (controls.down) {
                    player.setVelocityY(speed);
                    walking = true;
                }
                else {
                    player.setVelocityY(0);
                }
                if (controls.left) {
                    player.setVelocityX(-speed);
                    walking = true;
                }
                else if (controls.right) {
                    player.setVelocityX(speed);
                    walking = true;
                }
                else {
                    player.setVelocityX(0);
                }
                if (controls.interact && !player.interacting) {
                    interacting = true;
                    player.interacting = true;
                } else if (!controls.interact && player.interacting) {
                    player.interacting = false;
                }
            }
            if (walking) {
                console.log('walking');
                player.anims.play('hop', true);
                player.walking = true;
            } else if (player.walking) {
                player.anims.play('idle', true);
                player.walking = false;
                player.position = {x: player.x, y: player.y};
            }
            if (player) {
                const data = getTileData(game, player);
                const smoothFactor = 0.1;
                if (data.tile) {
                    if (data.tile.properties.speed) {
                        player.speed = data.tile.properties.speed;
                    } else {
                        player.speed = player.defaultSpeed;
                    }
                    if (data.tile.properties.align && !walking) {
                        const target = {
                            x: ((player.x - data.worldXY.x - (data.layer.baseTileWidth / 2)) * smoothFactor),
                            y: ((player.y - data.worldXY.y - (data.layer.baseTileHeight / 2)) * smoothFactor)
                        };
                        player.setPosition(player.x - target.x, player.y - target.y);
                        if (interacting && player.id === playerID && data.tile.properties.transport) {
                            changeMap(game, player);
                        }
                    }
                }
            }
        }
    }
}

export function getTileData(game, player) {
    const data = {};
    data.tileXY = game.map.worldToTileXY(player.x, player.y);
    data.worldXY = game.map.tileToWorldXY(data.tileXY.x, data.tileXY.y);
    data.tile = game.map.getTileAt(data.tileXY.x, data.tileXY.y);
    data.layer = game.map.getLayer();

    return data;
}

function changeMap(game, player) {
    player.anims.play("delete", true);
    console.log(game, player);
}