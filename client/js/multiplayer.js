/** @namespace io.sockets */
//////start of socket.io setup code///////////
const fs = require('fs');
const options = {
    key: fs.readFileSync('C:/Users/brand/AppData/Roaming/letsencrypt-win-simple/httpsacme-v01.api.letsencrypt.org/brandonvdongen.nl-key.pem'),
    cert: fs.readFileSync('C:/Users/brand/AppData/Roaming/letsencrypt-win-simple/httpsacme-v01.api.letsencrypt.org/brandonvdongen.nl-crt.pem'),
    ca: fs.readFileSync('C:/Users/brand/AppData/Roaming/letsencrypt-win-simple/httpsacme-v01.api.letsencrypt.org/ca-0A0141420000015385736A0B85ECA708-crt.pem')
};
const app = require('https').createServer(options);
const io = require('socket.io')(app);

app.listen(8000);
///////end of socket.io setup code///////////
const Client_handler = require("./modules/client_handler.js");
const Map_handler = require('./modules/maps.js');

const maps = {};
const server_id = Math.random().toString(36).substr(2, 5);
io.on('connection', function socket_handler(socket) {
    console.log("connecting     ", socket.id);

    const client = new Client_handler();
    const mapServ = new Map_handler();
    let local_client = {};
    const new_client = client.new_client(socket.id);
    new_client.server_id = server_id;
    socket.emit("userdata_to_client", new_client);

    socket.on("control", (data) => {
        local_client.controls = data.controls;
        local_client.position = data.position;
        if (local_client) {
            if (maps[local_client.map]) {
                if (!maps[local_client.map][socket.id]) {
                    maps[local_client.map][socket.id] = {};
                }
                maps[local_client.map][socket.id].controls = data.controls;
                maps[local_client.map][socket.id].position = data.position;
                local_client.controls = data.controls;
                local_client.position = data.position;
                const send_data = {id: socket.id, controls: local_client.controls, position: local_client.position};
                socket.to(local_client.map).emit("move_pawn", send_data);
                socket.emit("move_pawn", send_data);
            }
        }
    });
    socket.on("update_client_on_server", (data) => {
        const current_map = local_client.map;
        const target_map = data.map;
        local_client = data;
        if (maps[data.map] === undefined) {
            maps[data.map] = {};
        }
        if (maps[data.map][data.id] === undefined) {
            socket.emit("load_map", mapServ[data.map]);
        }
        if (!maps[local_client.map]) maps[local_client.map] = {};
        if (!maps[local_client.map][socket.id]) {
            maps[local_client.map][socket.id] = local_client;
            socket.join(local_client.map);
            socket.to(local_client.map).emit("add_pawn", local_client);
            socket.emit("update_all_pawns", maps[local_client.map]);
        }
        console.log(current_map,target_map);
        if (current_map !== target_map) {

            socket.leave(local_client.map, () => {
                socket.to(local_client.map).emit("remove_pawn", local_client);
                socket.join(data.map);
                socket.emit("load_map", mapServ[data.map]);
                console.log("transfering >", local_client.name, "|", local_client.map, ">", data.map);
                socket.to(data.map).emit("add_pawn", local_client);
                socket.emit("update_all_pawns", maps[data.map]);
            });
        }
    });
    socket.on("disconnect", () => {
        console.log("disconnecting  ", socket.id);
        if (local_client) {
            if (maps[local_client.map]) {
                if (maps[local_client.map][socket.id]) delete maps[local_client.map][socket.id];
            }
        }
        if (local_client) {
            socket.to(local_client.map).emit("remove_pawn", local_client.id);
        }
    });
    socket.on("send_message", function (data) {
        if (data.msg.charAt(0) !== "/") {
            socket.to(local_client.map).emit("chat_message", data);
            socket.emit("chat_message", data);
        } else {
            const cmdline = data.msg.slice(1).split(" ");
            const cmd = cmdline[0];
            const params = cmdline.slice(1);
            let changes = {id: socket.id};
            let change = false;

            if (cmd === "bodycolor") {
                const isOk = /^#[0-9A-F]{6}$/i.test(params[0]);
                if (isOk) {
                    socket.emit("chat_message", {id: socket.id, msg: "*poof*"});
                    maps[local_client.map][socket.id].colors.body = params[0];
                    local_client.colors.body = params[0];
                    changes.colors = {};
                    changes.colors.body = local_client.colors.body;


                } else {
                    socket.emit("chat_message", {id: socket.id, msg: "invalid color!"});
                }
                change = true;
            }
            else if (cmd === "bordercolor") {
                const isOk = /^#[0-9A-F]{6}$/i.test(params[0]);
                if (isOk) {
                    socket.emit("chat_message", {id: socket.id, msg: "*poof*"});
                    maps[local_client.map][socket.id].colors.border = params[0];
                    local_client.colors.border = params[0];
                    changes.colors = {};
                    changes.colors.border = local_client.colors.border;

                } else {
                    socket.emit("chat_message", {id: socket.id, msg: "invalid color!"});
                }
                change = true;
            }
            else if (cmd === "size") {
                socket.emit("chat_message", {id: socket.id, msg: "*poof*"});
                maps[local_client.map][socket.id].colors.border = params[0];
                local_client.size.height = params[0]+"px";
                local_client.size.width = params[0]+"px";
                changes.size = {};
                changes.size.height = local_client.size.height;
                changes.size.width = local_client.size.width;
                change = true;
            }
            else if (cmd === "name") {
                socket.emit("chat_message", {id: socket.id, msg: "*poof*"});
                local_client.name = params.join(" ");
                maps[local_client.map][socket.id].name = params.join(" ");
                changes.name = local_client.name;
                change = true;
            }
            else if (cmd === "changemap") {
                socket.emit("chat_message", {id: socket.id, msg: "*teleporting!*"});
                //local_client.map = maps[local_client.map][socket.id].map = params[0];
                let new_client = Object.assign({}, local_client);
                new_client.map = params[0];
                socket.emit("change_map", new_client);
            }
            if (change === true) {
                Object.assign(maps[local_client.map][socket.id], changes);
                socket.to(local_client.map).emit("update_pawn", changes);
                socket.emit("update_pawn", changes);
                local_client = maps[local_client.map][socket.id];
            }

        }
    });
})
;
console.log('server starting with ID: ', server_id);