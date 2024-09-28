document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
});

function loadTheme() {
    let theme = localStorage.getItem("ar.customTheme");
    if (theme) {
        let theme_json = JSON.parse(theme);
        Object.keys(theme_json).forEach(key => {
            document.body.style.setProperty(key, theme_json[key]);
        });
    }
}

function customThemeJSON(json) {
    if (typeof json === 'object') {
        localStorage.setItem("ar.customTheme", JSON.stringify(json));
        loadTheme();
    }
}

function removeTheme() {
    localStorage.removeItem("ar.customTheme");
    customThemeJSON({
        "--background": "#181926",
        "--background2": "#24273a",
        "--background3": "#363a4f",
        "--background4": "#494d64",
        "--theme": "rgb(138, 173, 244)",
        "--shadow": "rgba(138, 173, 244, 0.5)",
        "--text": "#cad3f5"
    });
}

