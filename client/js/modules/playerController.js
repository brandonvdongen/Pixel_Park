export let playerID;
export const characters = {};

export function setPlayerID(id) {
    playerID = id;
}

export function preload(game) {
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
    sprite.moveBlock = [];
    sprite.defaultSpeed = 100;
    sprite.speed = 100;
    sprite.position = position;
    sprite.id = id;
    characters[id] = sprite;
    return sprite;
}

export function update(game, config) {
    for (const id in characters) {
        if (characters.hasOwnProperty(id)) {

            if (id !== playerID) {
                console.log(characters[id]);
            }
        }
    }

}