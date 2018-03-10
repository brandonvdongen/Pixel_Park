import {bgmSongList} from "../data/songs.js";

let background_music;

export function randomSongKey() {
    const keys = Object.keys(bgmSongList);
    return keys[keys.length * Math.random() << 0];
}

export function playBGM(game, key) {
    if (background_music) background_music.destroy();
    background_music = game.sound.add(key);
    background_music.pauseOnBlur = false;
    background_music.volume = 0.05;
    background_music.loop = true;
    background_music.play();
}