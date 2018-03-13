export let storage =
    {
        settings: {
            resolution: JSON.parse(localStorage.getItem("resolution")) || {height: 600, width: 800}
        },
        mainCamera: undefined,
        alignment: {
            centered: {},
            topLeft: {}
        },
        controls: {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
            interact: 0
        },
        multiplayer: {},
        player: {}
    };