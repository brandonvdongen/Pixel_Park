import {storage} from "../data/storage.js";
import * as playerController from "./playerController.js";

let socket;

export function connect(game) {
    return new Promise(function (resolve, reject) {
        socket = io('https://brandonvdongen.nl:8000');

        socket.on("connect", () => {
            console.log("connecting...");
            if (!storage.online) {
                socket.emit('identify', {version: storage.version, game_name: storage.game_name});
            } else {
                console.log("Connection lost");
                socket.close();
            }
        });

        socket.on("server_missmatch", () => {
            console.error("your version doesn't match with the server!");
            socket.close();
            reject();
        });

        socket.on("identified", (data) => {
            console.log("identified, login succesfull", data);
            data.online = true;
            resolve(data);
        });

        socket.on("change_map", (data) => {
            console.log(data);
            storage.activeScene.scene.start(data.map);
        });

        socket.on("joined", (data) => {
            console.log("joined", data);
            storage.multiplayer[data.id] = playerController.createPlayer(storage.activeScene, storage.sceneSpawn, "#ffffff");
        });

        socket.on("left", (data) => {
            if (storage.multiplayer[data.id]) {
                storage.multiplayer[data.id].sprite.destroy();
                delete storage.multiplayer[data.id];
            }
            console.log("left", data);
        });

        socket.on("update", (data) => {
            if (!storage.multiplayer[data.id]) {
                storage.multiplayer[data.id] = playerController.createPlayer(storage.activeScene, data.position, "#ffffff");
            }
            data.sprite = storage.multiplayer[data.id].sprite;
            storage.multiplayer[data.id] = data;
            playerController.move_player(data.sprite, data.controls, data.position);
        });

    });
}

export function update_multiplayers(pos) {
    for (const id in storage.multiplayer) {
        if (storage.multiplayer.hasOwnProperty(id)) {
            const player = storage.multiplayer[id].sprite;
            const controls = storage.multiplayer[id].controls;
            const position = pos || {x:player.x,y:player.y};
            if(position)player.setPosition(position.x, position.y);
            player.setVelocity(0, 0);
            let walking = false;
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
                if (walking) player.anims.play('hop', true);
                else player.anims.play('idle', true);
                player.depth = player.y;
            }
        }
    }
}

export function update() {
    if (socket) {
        const playerdata = JSON.parse(JSON.stringify(storage.player));
        delete playerdata.sprite;
        console.log(playerdata);
        socket.emit("update", playerdata);
    }
}