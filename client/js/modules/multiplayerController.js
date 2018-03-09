import {storage} from "../data/storage.js";


export function connect(game) {
    return new Promise(function (resolve, reject) {
        let socket = io('https://brandonvdongen.nl:8000');

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

    });
}