let remote_players = {};
let movement = {Left: 0, Right: 0, Jump: 0};

function update_movement(player, movement) {
    if (!gameover && player) {
        if (movement["Left"]) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (movement["Right"]) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if ((movement["Jump"]) && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }
}

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
                    remote_players[data.id].player.setPosition(data.position.x, data.position.y + 25);
                    remote_players[data.id].movement = data.movement;
                    if (data.movement) {
                        update_movement(remote_players[data.id].player, data.movement);
                    }
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

    function emit_movement() {
        const player_data = {};
        player_data.id = player_id;
        player_data.velocity = player.body.velocity;
        player_data.position = player.body.position;
        player_data.movement = movement;
        socket.emit('update', player_data);
    }

    const keybinds = {
        KeyA: "Left",
        ArrowLeft: "Left",
        KeyD: "Right",
        ArrowRight: "Right",
        Space: "Jump",
        ArrowUp: "Jump"
    };
    document.addEventListener('keydown', function (e) {
        if (e.code in keybinds) {
            if (movement[keybinds[e.code]] !== 1) {
                movement[keybinds[e.code]] = 1;
                emit_movement();
            }
        }
    });
    document.addEventListener("keyup", function (e) {
        if (e.code in keybinds) {
            if (movement[keybinds[e.code]] !== 0) {
                movement[keybinds[e.code]] = 0;
                emit_movement();
            }
        }
    });

    setInterval(() => {
        for (let id in remote_players) {
            if(remote_players[id].player && remote_players[id].movement){
                console.log(remote_players[id].player.body.velocity);
                update_movement(remote_players[id].player, remote_players[id].movement);
            }
        }
    }, 100)
}
