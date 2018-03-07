import {bgmSongList} from "./../data/songs.js";

let background_music;

export function playBGM(game,key) {
    if (background_music) background_music.destroy();
    background_music = game.sound.add(key);
    background_music.pauseOnBlur = false;
    background_music.volume = 0.1;
    background_music.loop = true;
    background_music.play();
    console.log("playing :",bgmSongList[key].name,"By:",bgmSongList[key].author);
}