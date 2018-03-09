/** @namespace io.sockets */

let version = 1;
let game_name = "pixel_park";

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

const players = {};
const maps = {};
let player;

const server_id = Math.random().toString(36).substr(2, 5);
io.on('connection', function socket_handler(socket) {

    player = {id: socket.id};
    if (!player[socket.id]) {
        players[socket.id] = player;
        player.map = "Voxalia";
    }

    console.log(player.id,"> connecting");
    socket.on('identify', (data) => {
        if (data.version !== version || data.game_name !== game_name) {
            console.log(player.id, "> missmatched");
            socket.emit("server_missmatch");
        } else {
            console.log(player.id,"> connected successfully");
            socket.emit("identified", players[player.id]);
            socket.join(player.map);

            setTimeout(() => {
                if (maps[player.map]) {
                    if (maps[player.map][player.id]) {
                        delete maps[player.map][player.id];
                    }
                }
                socket.leave(player.map);
                player.map = "PixilTown";
                if (!maps[player.map]) maps[player.map] = {};
                if (!maps[player.map][player.id]) maps[player.map][player.id] = player;
                socket.join(player.map);
                socket.emit("change_map", {map: player.map, users: maps[player.map]});
            }, 15000);
        }
    });

    socket.on("disconnect", (data) => {
        console.log(player.id, "> disconnected");
    });
});
console.log('server starting with ID: ', server_id);