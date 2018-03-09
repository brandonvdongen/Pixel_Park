export let storage =
    {
        settings: {
            resolution: JSON.parse(localStorage.getItem("resolution")) || {height: 600, width: 800}
        },
        mainCamera: undefined,
        alignment: {
            centered: {},
            topLeft:{}
        }
    };