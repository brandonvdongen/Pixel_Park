let preloader;
let text;
let progress;
let filesLoaded = 0;

function createPreloader() {
    preloader = document.createElement("div");
    text = document.createElement("div");
    progress = document.createElement("div");

    preloader.classList.add("preloader");
    progress.classList.add("progress");
    text.classList.add("text");

    preloader.appendChild(progress);
    preloader.appendChild(text);
    document.body.appendChild(preloader);
}

function update(file, value, loading, filesToLoad) {
    if (!preloader) createPreloader();
    let status_text;
    let totalProgress = 0;
    loading[file.key] = value;

    for (const key in loading) {
        if (loading.hasOwnProperty(key)) {
            status_text = "Downloading (" + (filesLoaded + 1) + "/" + filesToLoad + ") " + key + ":" + Math.round(loading[key] * 100) + "%";
            totalProgress += loading[key];
            progress.style.width = 600 * (totalProgress / filesToLoad) + "px";
        }
    }

    text.innerText = status_text;
    if (totalProgress / filesToLoad === 1) text.innerText = "Loading Game...";
    if (value === 1) filesLoaded++;
}

export function done() {
    preloader.classList.add("done");
}

export function start(game) {
    let filesToLoad = 0;
    filesLoaded = 0;
    if (!preloader) createPreloader();
    preloader.classList.remove("done");

    const loading = {};
    game.load.on('fileprogress', function (file, value) {
        filesToLoad = game.load.totalToLoad;
        update(file, value, loading, filesToLoad);
    }.bind(this));

    game.load.maxParallelDownloads = 1;
    game.load.on('complete', function () {
        done();
    });

}