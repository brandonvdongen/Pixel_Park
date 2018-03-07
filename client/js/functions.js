function update_hud() {
    scoreText.setText('Score: ' + score);
    roundText.setText('Round: ' + round);
    playerCountText.setText('Players: ' + (Object.keys(remote_players).length));
}

function resetStars(stars) {
    stars.children.iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

    });
}

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;

    if (stars.countActive(true) === 0) {
        resetStars(stars);
        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        let bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

        round++;

    }
    update_hud();
}

function hitBomb(player, bomb) {
    if (!gameover) {
        player.setVelocity(0, -300);
        player.setCollideWorldBounds(false);
        if (collider !== null) {
            collider.active = false;
        }
        player.anims.play('turn');
        gameover = 1;
    }
}

function restart(game, player) {
    player.setCollideWorldBounds(true);
    collider.active = true;
    bombs.children.iterate(function (child) {
        child.destroy();
    });
    score = 0;
    round = 0;
    player.setVelocity(0, 0);
    player.setPosition(100, 450);
    update_hud();
    console.log(game);
    resetStars(stars);
    gameover = 0;
    game.physics.resume();
}