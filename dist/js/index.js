!function (e) {
    var t = {};

    function i(s) {
        if (t[s]) return t[s].exports;
        var o = t[s] = {i: s, l: !1, exports: {}};
        return e[s].call(o.exports, o, o.exports, i), o.l = !0, o.exports
    }

    i.m = e, i.c = t, i.d = function (e, t, s) {
        i.o(e, t) || Object.defineProperty(e, t, {configurable: !1, enumerable: !0, get: s})
    }, i.r = function (e) {
        Object.defineProperty(e, "__esModule", {value: !0})
    }, i.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return i.d(t, "a", t), t
    }, i.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, i.p = "", i(i.s = 0)
}([function (e, t, i) {
    "use strict";
    let s, o, a;
    i.r(t);
    let n = 0;

    function r() {
        s = document.createElement("div"), o = document.createElement("div"), a = document.createElement("div"), s.classList.add("preloader"), a.classList.add("progress"), o.classList.add("text"), s.appendChild(a), s.appendChild(o), document.body.appendChild(s)
    }

    function l(e) {
        let t = 0;
        n = 0, s || r(), s.classList.remove("done");
        const i = {};
        e.load.on("fileprogress", function (l, c) {
            t = e.load.totalToLoad, function (e, t, i, l) {
                let c;
                s || r();
                let p = 0;
                i[e.key] = t;
                for (const e in i) i.hasOwnProperty(e) && (c = "Downloading (" + (n + 1) + "/" + l + ") " + e + ":" + Math.round(100 * i[e]) + "%", p += i[e], a.style.width = p / l * 600 + "px");
                o.innerText = c, p / l == 1 && (o.innerText = "Loading Game..."), 1 === t && n++
            }(l, c, i, t)
        }.bind(this)), e.load.maxParallelDownloads = 1, e.load.on("complete", function () {
            s.classList.add("done")
        })
    }

    let c, p = {
        settings: {resolution: JSON.parse(localStorage.getItem("resolution")) || {height: 600, width: 800}},
        mainCamera: void 0,
        alignment: {centered: {}, topLeft: {}},
        controls: {up: 0, down: 0, left: 0, right: 0},
        multiplayer: {},
        player: {}
    }, d = {
        song_witchesGetBitches: {
            name: "Strike Witches Get Bitches",
            author: "Azureflux",
            src: "assets/music/Azureflux_-_02_-_Strike_Witches_Get_Bitches.ogg"
        },
        song_bitBossa: {name: "Bit Bossa", author: "Azureflux", src: "assets/music/Azureflux_-_07_-_Bit_Bossa.ogg"},
        song_electrodoodle: {name: "Electricdoodle", author: "Kevin MacLeod", src: "assets/music/Electrodoodle.ogg"},
        song_chiphInstrumental: {
            name: "Chipho Instrumental",
            author: "RoccoW",
            src: "assets/music/RoccoW_-_Chipho_instrumental.ogg"
        },
        song_nontindeVendorTheme: {
            name: "Nontinde Vendor Theme",
            author: "RoccoW",
            src: "assets/music/RoccoW_-_Nontinde_Vendor_Theme.ogg"
        },
        song_XinyueTheme: {
            name: "Xinyue Theme 1",
            author: "The J Arhur Keenes Band",
            src: "assets/music/The_J_Arthur_Keenes_Band_-_01_-_Xinyue_Theme_1.ogg"
        }
    };

    function m(e, t) {
        c && c.destroy(), (c = e.sound.add(t)).pauseOnBlur = !1, c.volume = .05, c.loop = !0, c.play()
    }

    const u = {KeyW: "up", KeyA: "left", KeyS: "down", KeyD: "right"};

    function h(e) {
        if (u[e]) return u[e]
    }

    let y, g, f, w = !1;

    function _(e, t, i) {
        let s = !1;
        i && e.setPosition(i.x, i.y), t && e && p.player && (t.up ? (e.setVelocityY(-100), s = !0) : t.down ? (e.setVelocityY(100), s = !0) : e.setVelocityY(0), t.left ? (e.setVelocityX(-100), s = !0) : t.right ? (e.setVelocityX(100), s = !0) : e.setVelocityX(0), s ? (e.anims.play("hop", !0), e.walking = !0) : !0 === e.walking && (e.anims.play("idle", !0), e.walking = !1), e.position && (e.depth = e.position.y), p.player.controls = t, p.player.position = e.position)
    }

    function x(e, t, i) {
        const s = new C(e, t, i);
        let o = p.controls;
        return _(s.sprite, o, s.sprite.position), s.sprite.anims.play("spawn", !0), s
    }

    class C {
        constructor(e, t = {x: 100, y: 100}, i = "#ffffff") {
            this.id = p.player.id, this.color = i, this.sprite = e.physics.add.sprite(16, 16, "player"), this.sprite.setSize(10, 10), this.sprite.setOffset(11, 14), this.sprite.setPosition(t.x, t.y), this.sprite.setCollideWorldBounds(!0), this.sprite.setBounce(0), this.position = t, this.controls = {
                up: 0,
                down: 0,
                left: 0,
                right: 0
            }
        }
    }

    function v(e) {
        for (const t in p.multiplayer) if (p.multiplayer.hasOwnProperty(t)) {
            const i = p.multiplayer[t].sprite, s = p.multiplayer[t].controls, o = e || {x: i.x, y: i.y};
            o && i.setPosition(o.x, o.y), i.setVelocity(0, 0);
            let a = !1;
            s && i && (s.up ? (i.setVelocityY(-100), a = !0) : s.down ? (i.setVelocityY(100), a = !0) : i.setVelocityY(0), s.left ? (i.setVelocityX(-100), a = !0) : s.right ? (i.setVelocityX(100), a = !0) : i.setVelocityX(0), a ? (i.anims.play("hop", !0), i.walking = !0) : !0 === i.walking && (i.anims.play("idle", !0), i.walking = !1), i.position && (i.depth = i.position.y))
        }
    }

    function T() {
        if (y) {
            const e = JSON.parse(JSON.stringify(p.player));
            delete e.sprite, console.log(e), y.emit("update", e)
        }
    }

    function S(e, t, i) {
        for (const s in t) t.hasOwnProperty(s) && ("map" === i ? e.load.tilemapTiledJSON(s, t[s]) : "image" === i ? e.load.image(s, t[s]) : "audio" === i && e.load.audio(s, t[s]), console.log(s, ":", t[s]))
    }

    const V = {
        maps: {Map_PixilTown: "assets/tilemap/PixilTown.json"},
        images: {Tiles_PixilTown: "assets/tiles/PixilTown.png"},
        audio: {song_XinyueTheme: d.song_XinyueTheme.src}
    };
    let P, k;
    let B = JSON.parse(localStorage.getItem("resolution")) || {height: 600, width: 800};
    localStorage.setItem("resolution", JSON.stringify(B));
    const W = {
        type: Phaser.CANVAS,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {default: "arcade", arcade: {gravity: {y: 0}, debug: !1}},
        scene: [class extends Phaser.Scene {
            constructor() {
                super({key: "MainMenu"})
            }

            preload() {
                var e;
                l(this), (e = this).load.image("player", "assets/sprites/player.png"), e.load.spritesheet("player_idle", "assets/sprites/player_idle.png", {
                    frameWidth: 32,
                    frameHeight: 32
                }), e.load.spritesheet("player_hop", "assets/sprites/player_hop.png", {
                    frameWidth: 32,
                    frameHeight: 32
                }), e.load.spritesheet("player_spawn", "assets/sprites/player_spawn.png", {
                    frameWidth: 32,
                    frameHeight: 32
                }), e.load.on("complete", () => {
                    e.anims.create({
                        key: "idle",
                        frames: e.anims.generateFrameNumbers("player_idle", {start: 0, end: 2}),
                        frameRate: 2,
                        repeat: -1
                    }), e.anims.create({
                        key: "hop",
                        frames: e.anims.generateFrameNumbers("player_hop", {start: 0, end: 6}),
                        frameRate: 12,
                        repeat: -1
                    }), e.anims.create({
                        key: "spawn",
                        frames: e.anims.generateFrameNumbers("player_spawn", {start: 0, end: 14}),
                        frameRate: 12,
                        repeat: 0,
                        onComplete: function (e) {
                            console.log("player spawned")
                        }
                    }), e.anims.create({
                        key: "delete",
                        frames: e.anims.generateFrameNumbers("player_spawn", {frames: [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]}),
                        frameRate: 12,
                        repeat: 0,
                        onComplete: function (e) {
                            e.destroy()
                        }
                    });
                    let t = p.controls;
                    w || (document.addEventListener("keydown", e => {
                        const i = h(e.code);
                        t[i] || void 0 === i || (t[i] = 1, T())
                    }), document.addEventListener("keyup", e => {
                        const i = h(e.code);
                        t[i] && (t[i] = 0, T())
                    }), w = !0)
                })
            }

            create() {
                p.activeScene = this, this.sound.pauseOnBlur = !1, this.input.once("pointerdown", function (e) {
                    this.scene.start("PixilTown")
                }, this), new Promise(function (e, t) {
                    (y = io("https://brandonvdongen.nl:8000")).on("connect", () => {
                        console.log("connecting..."), p.online ? (console.log("Connection lost"), y.close()) : y.emit("identify", {
                            version: p.version,
                            game_name: p.game_name
                        })
                    }), y.on("server_missmatch", () => {
                        console.error("your version doesn't match with the server!"), y.close(), t()
                    }), y.on("identified", t => {
                        console.log("identified, login succesfull", t), t.online = !0, e(t)
                    }), y.on("change_map", e => {
                        console.log(e), p.activeScene.scene.start(e.map)
                    }), y.on("joined", e => {
                        console.log("joined", e), p.multiplayer[e.id] = x(p.activeScene, p.sceneSpawn, "#ffffff"), p.multiplayer[e.id].sprite.anims.play("spawn", !0)
                    }), y.on("left", e => {
                        p.multiplayer[e.id] && (p.multiplayer[e.id].sprite.anims.play("delete", !0), delete p.multiplayer[e.id]), console.log("left", e)
                    }), y.on("update", e => {
                        p.multiplayer[e.id] || (p.multiplayer[e.id] = x(p.activeScene, e.position, "#ffffff")), e.sprite = p.multiplayer[e.id].sprite, p.multiplayer[e.id] = e, _(e.sprite, e.controls, e.position)
                    })
                }).then(e => {
                    p.player.id = e.id, this.scene.start(e.map)
                })
            }

            update() {
            }
        }, class extends Phaser.Scene {
            constructor() {
                super({key: "PixilTown"})
            }

            preload() {
                var e, t;
                l(this), e = this, t = V, console.log("loading map"), S(e, t.maps, "map"), S(e, t.images, "image"), S(e, t.audio, "audio")
            }

            create() {
                p.activeScene = this, f = this.make.tilemap({key: "Map_PixilTown"}), console.log(f.layers);
                const e = f.addTilesetImage("Tiles_PixilTown"), t = f.createStaticLayer("Ground", e, 0, 0),
                    i = f.createStaticLayer("Bridge", e, 0, 0);
                f.setLayer(t), t.setCollisionBetween(9, 11), t.setCollision(-1), t.setCollisionFromCollisionGroup(), i.setCollisionFromCollisionGroup(), p.mainCamera = this.cameras.main, p.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight), p.mainCamera.setZoom(3), this.sound.pauseOnBlur = !1, m(this, "song_XinyueTheme");
                const s = f.tileToWorldXY(2, 2, {}, p.mainCamera, t);
                s.x -= f.tileWidth / 2, s.y -= f.tileHeight / 2, p.sceneSpawn = s, p.player = x(this, s, "#ffffff"), this.physics.add.collider(p.player.sprite, t), this.physics.add.collider(p.player.sprite, i), p.cameraTarget = p.player.sprite
                console.log(this);
            }

            update(e, t) {
                var i, s;
                i = p.cameraTarget, s = .9, i && (void 0 === s && (s = 0), p.mainCamera.scrollX = s * p.mainCamera.scrollX + (1 - s) * (i.x - .5 * p.mainCamera.width), p.mainCamera.scrollY = s * p.mainCamera.scrollY + (1 - s) * (i.y - .5 * p.mainCamera.height)), g = p.player.sprite;
                let o = p.controls;
                g.position = {x: g.x, y: g.y}, _(g, o, g.position), v()
            }
        }, class extends Phaser.Scene {
            constructor() {
                super({key: "Voxalia"})
            }

            preload() {
                console.log("loading map"), l(this), this.load.audio("song_bitBossa", d.song_bitBossa.src), this.load.image("Voxalia", "assets/tiles/Voxalia.png"), this.load.tilemapTiledJSON("Map_Voxalia", "assets/tilemap/Voxalia.json")
            }

            create() {
                p.activeScene = this;
                const e = (k = this.make.tilemap({key: "Map_Voxalia"})).addTilesetImage("Voxalia"),
                    t = k.createStaticLayer("Ground", e, 0, 0), i = k.createStaticLayer("Bridge", e, 0, 0);
                k.setLayer(t), t.setCollisionBetween(9, 11), t.setCollision(-1), t.setCollisionFromCollisionGroup(), i.setCollisionFromCollisionGroup(), p.mainCamera = this.cameras.main, p.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight), p.mainCamera.setZoom(3), this.sound.pauseOnBlur = !1, m(this, "song_bitBossa");
                const s = k.tileToWorldXY(2, 5, {}, p.mainCamera, t);
                s.x -= k.tileWidth / 2, s.y -= k.tileHeight / 2, p.sceneSpawn = s, p.player = x(this, s, "#ffffff"), this.physics.add.collider(p.player.sprite, t), this.physics.add.collider(p.player.sprite, i), p.cameraTarget = p.player.sprite, this.matter.world.createDebugGraphic(), this.matter.world.drawDebug = !1
            }

            update(e, t) {
                var i, s;
                i = p.cameraTarget, s = .9, i && (void 0 === s && (s = 0), p.mainCamera.scrollX = s * p.mainCamera.scrollX + (1 - s) * (i.x - .5 * p.mainCamera.width), p.mainCamera.scrollY = s * p.mainCamera.scrollY + (1 - s) * (i.y - .5 * p.mainCamera.height)), P = p.player.sprite;
                let o = p.controls;
                P.position = {x: P.x, y: P.y}, _(P, o, P.position), v()
            }
        }],
        pixelArt: !0
    }, b = new Phaser.Game(W);
    window.onresize = function () {
        b.resize(window.innerWidth, window.innerHeight, 1), p.mainCamera && p.mainCamera.setViewport(0, 0, window.innerWidth, window.innerHeight)
    }, p.version = 2, p.game_name = "pixel_park"
}]);