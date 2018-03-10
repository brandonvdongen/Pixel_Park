import {getKeyBind} from "../utility/keyBind.js";
import {storage} from "../data/storage.js";
import * as multiplayerController from "../modules/multiplayerController.js";

let started = false;


export function preload(game) {
    game.load.image('player', "assets/sprites/player.png");
    game.load.spritesheet('player_idle', "assets/sprites/player_idle.png", {frameWidth: 32, frameHeight: 32});
    game.load.spritesheet('player_hop', "assets/sprites/player_hop.png", {frameWidth: 32, frameHeight: 32});

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
    if(position)player.setPosition(position.x, position.y);
    let walking = false;
    if (controls && player && storage.player) {
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
        if (walking) player.anims.play('hop', true);
        else player.anims.play('idle', true);
        if(player.position)player.depth = player.position.y;
        storage.player.controls = controls;
        storage.player.position = player.position;
    }
}

export function createPlayer(game, origin, color) {
    const player = new PlayerController(game, origin, color);
    let controls = storage.controls;
    move_player(player.sprite, controls, player.sprite.position);
    return player;
}

class PlayerController {
    constructor(game, origin = {x: 100, y: 100}, color = "#ffffff") {
        this.id = storage.player.id;
        this.color = color;
        this.sprite = game.physics.add.sprite(16, 16, 'player');
        this.sprite.setSize(10, 10);
        this.sprite.setOffset(11, 14);
        this.sprite.setPosition(origin.x, origin.y);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0);
        // this.sprite.body.position.y -= 3;
        this.position = origin;
        this.controls = {
            up: 0,
            down: 0,
            left: 0,
            right: 0
        }
    }
}

