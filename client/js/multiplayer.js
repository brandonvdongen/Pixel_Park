let remote_players = {};

function start_multiplayer() {
    let socket = io('https://brandonvdongen.nl:8000');

    const data_storage = {connected: false};
    socket.on("connected", (data) => {
        if (data_storage.connected) {
            location.reload(true);
        } else {
            console.log("connected", data);
            player_id = data.id;
            data_storage.connected = true;
        }
    });

    socket.on("joined", (data) => {
        console.log("joined", data);
        remote_players[data.id] = data;
        console.log(remote_players);
    });

    socket.on("left", (data) => {
        console.log("left", data);
        if (remote_players[data.id]) {
            remote_players[data.id].player.destroy();
            delete remote_players[data.id];

        }
        console.log(remote_players);
        update_hud();
    });

    socket.on("players", (data) => {
        remote_players = data;
    });

    socket.on("update_other", (data) => {
        if (go) {
            if (data.id !== player_id) {
                if (!remote_players[data.id]) remote_players[data.id] = data;
                if (remote_players[data.id].player) {
                    remote_players[data.id].player.setVelocity(data.velocity.x, data.velocity.y);
                    remote_players[data.id].player.setPosition(data.position.x, data.position.y + 25);
                } else {
                    const new_player = go.physics.add.sprite(100, 450, 'dude');
                    new_player.setBounce(0.1);
                    new_player.setCollideWorldBounds(true);
                    go.physics.add.collider(new_player, platforms);
                    remote_players[data.id].player = new_player;
                }
                if (!remote_players[data.id].player) delete remote_players[data.id];
            }
        }
    });


    go.input.keyboard.on('keydown', function (event) {
        socket.emit('update', {id: player_id, velocity: player.body.velocity, position: player.body.position});
    });
    setInterval(() => {
        if (player && go) {
            socket.emit('update', {id: player_id, velocity: player.body.velocity, position: player.body.position});
            console.log(remote_players);
        }
    }, 1000);
}