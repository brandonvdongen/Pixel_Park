let platforms;
let stars;

let player;

let round = 1;
let score = 0;

let scoreText;
let roundText;
let playerCount = 1;
let playerCountText;
let bombs;

let controls = {};
let gameover = 0;

let collider;
let player_id;

let go;

const config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {

    let progress = this.add.graphics();

    this.load.on('progress', function (value) {

        progress.clear();
        progress.fillStyle(0xffffff, 1);
        progress.fillRect(0, 270, 800 * value, 60);
        console.log("progress:", value);

    });

    this.load.on('complete', function () {

        progress.destroy();

    });

    this.load.audio('bgm_calm', 'assets/music/Electrodoodle.mp3');
    // this.load.audio('bgm_calm', 'assets/music/BlockMan_Cephelopod.mp3');
    this.load.image('sky', 'assets/textures/world/sky.png');
    this.load.image('ground', 'assets/textures/world/platform.png');
    this.load.image('star', 'assets/textures/sprites/star.png');
    this.load.image('bomb', 'assets/textures/sprites/bomb.png');
    this.load.spritesheet('dude',
        'assets/textures/sprites/dude.png',
        {frameWidth: 32, frameHeight: 48}
    );
    this.load.spritesheet('dude2',
        'assets/textures/sprites/dude2.png',
        {frameWidth: 32, frameHeight: 48}
    );
}

function create() {
    const game = this;
    let background_music = this.sound.add('bgm_calm');
    background_music.volume = 0.05;
    background_music.play();
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'otherleft',
        frames: this.anims.generateFrameNumbers('dude2', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'otherturn',
        frames: [{key: 'dude2', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'otherright',
        frames: this.anims.generateFrameNumbers('dude2', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'dude', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });
    go = this;
    collider = this.physics.add.collider(player, platforms);
    controls.arrows = this.input.keyboard.createCursorKeys();

    controls.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    controls.velocity = player.body.velocity;

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70},
    });
    stars.children.iterate(function (star) {
        star.setBounce(.2);
    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    scoreText = this.add.text(16, 10, 'Score: 0', {fontSize: '30px', fill: '#000'});
    roundText = this.add.text(16, 40, 'Round: 1', {fontSize: '30px', fill: '#000'});
    playerCountText = this.add.text(16, 70, 'Players: Connecting...', {fontSize: '30px', fill: '#000'});

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.input.keyboard.on('keydown_R', function (event) {

        console.log('Hello from the r Key!');
        restart(game, player);

    });
    this.input.keyboard.on('keydown_Q', function (event) {

        if (collider !== null) {
            collider.active = false;
        }

    });
    running = true;
    start_multiplayer();

}

function update() {
    if (!gameover && controls) {
        if (controls.arrows.left.isDown || controls.wasd.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (controls.arrows.right.isDown || controls.wasd.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if ((controls.arrows.up.isDown || controls.wasd.up.isDown) && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }
}