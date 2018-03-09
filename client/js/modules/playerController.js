import {getKeyBind} from "../utility/keyBind.js";
import {storage} from "../data/storage.js";

let started = false;


export function preload(game) {
    game.load.image('player', "assets/sprites/player.png");
    game.load.spritesheet('player_idle', "assets/sprites/player_idle.png", {frameWidth: 16, frameHeight: 16});

    game.load.on("complete", () => {
        game.anims.create({
            key: 'idle',
            frames: game.anims.generateFrameNumbers('player_idle', {start: 0, end: 2}),
            frameRate: 2,
            repeat: -1
        });
        let controls = storage.controls;
        if (!started) {
            document.addEventListener("keydown", (ev) => {
                const button = getKeyBind(ev.code);
                if (!controls[button] && button !== undefined) {
                    controls[button] = 1;
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
    });
}

export function move_player(player, controls, position) {
    player.setPosition(position.x, position.y);
    if (controls && player) {
        if (controls.up) {
            player.setVelocityY(-1);
        } else if (controls.down) {
            player.setVelocityY(1);
        } else {
            player.setVelocityY(0);
        }

        if (controls.left) {
            player.setVelocityX(-1);
        } else if (controls.right) {
            player.setVelocityX(1);
        } else {
            player.setVelocityX(0);
        }
    }
}

export function createPlayer(game, origin, color) {
    const player = new PlayerController(game,origin,color);
    let controls = storage.controls;

    player.sprite.anims.play('idle', true);
    move_player(player.sprite, controls, player.sprite.body.position);
    return player;
}

class PlayerController {
    constructor(game, origin = {x: 100, y: 100}, color = "#ffffff") {
        this.color = color;
        this.sprite = game.matter.add.sprite(16, 16, 'player');
        this.sprite.setBody({type: 'circle', radius: 5, width: 10, height: 10});
        this.sprite.setFixedRotation();
        this.sprite.setPosition(origin.x,origin.y);
        console.log(origin);
        this.sprite.body.position.y -= 3;
    }
}

