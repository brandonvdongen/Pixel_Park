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

const players = {};

const server_id = Math.random().toString(36).substr(2, 5);
io.on('connection', function socket_handler(socket) {

    player = {id: socket.id};
    players[socket.id] = player;

    console.log("connecting", player);
    socket.emit("connected", player);
    socket.emit("players", players);
    socket.broadcast.emit("joined", player);


    socket.on("disconnect", (reason) => {
        socket.broadcast.emit("left", player);
        console.log("left", player);
        if (players[socket.id]) {
            delete players[socket.id];
        }
    });
    socket.on("update", (data) => {
        console.log(data);
        socket.broadcast.emit("update_other",data);
    })
})
;
console.log('server starting with ID: ', server_id);