import {storage} from "../data/storage.js";
import * as playerController from "./playerController.js";

let socket;

export function connect(menu) {
    if (!storage.game) storage.game = menu;
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
            map.scene.start(data.map);
        });

        socket.on("joined", (data) => {
            console.log("joined", data);
            console.log(storage.game);
            storage.multiplayer[data.id] = playerController.createPlayer(storage.game, storage.game.map.spawn, "#ffffff");
            storage.multiplayer[data.id].sprite.anims.play("spawn", true);
        });

        socket.on("left", (data) => {
            if (storage.multiplayer[data.id]) {
                storage.multiplayer[data.id].sprite.anims.play("delete", true);
                delete storage.multiplayer[data.id];
            }
            console.log("left", data);
        });

        socket.on("update", (data) => {
            if (!storage.multiplayer[data.id]) {
                map.spawn = data.position;
                storage.multiplayer[data.id] = playerController.createPlayer(storage.game, data.position, "#ffffff");
            }
            data.sprite = storage.multiplayer[data.id].sprite;
            storage.multiplayer[data.id] = data;
            playerController.move_player(data.sprite, data.controls, data.position);
        });

    });
}

export function update_multiplayers(game) {
    for (const id in storage.multiplayer) {
        if (storage.multiplayer.hasOwnProperty(id)) {
            const player = storage.multiplayer[id];
            playerController.updatePlayerMovement(game,player,player.controls,player.position);
            console.log(storage.multiplayer[id]);
        }
    }
}

export function update() {
    if (socket) {
        const playerdata = JSON.parse(JSON.stringify(storage.player));
        delete playerdata.sprite;
        socket.emit("update", playerdata);
    }
}