if(typeof VERSION !== 'undefined'){
    pc.Asset.prototype.getFileUrl = function () {
        var file = this.file;
        if (!file || !file.url) return null;
        var url = file.url;
        if (this.registry && this.registry.prefix && !ABSOLUTE_URL.test(url)) url = this.registry.prefix + url;

        if (this.type !== 'script' && file.hash) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            url += separator + 't=' + file.hash + '?v=' + VERSION;
        }else{
            url += '?v=' + VERSION;
        }

        return url;
    };
}

pc.script.createLoadingScreen(function (app) {
    var link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    link.crossorigin = true;
    document.head.appendChild(link);

    var link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossorigin = true;

    document.head.appendChild(link2);

    /*var fontawesome = document.createElement('script');
    fontawesome.src = 'https://kit.fontawesome.com/4f818e8f9d.js';
    fontawesome.crossorigin = true;*/

    var fontawesome = document.createElement('link');
    fontawesome.href = 'https://venge.io/fontawesome/css/font-awesome.min.css';
    fontawesome.rel = 'stylesheet';
    fontawesome.type = 'text/css';
    document.head.appendChild(fontawesome);

    var link3 = document.createElement('link');
    link3.rel = 'preconnect';
    link3.href = 'https://fonts.googleapis.com/css2?family=Passion+One&display=swap';
    link3.rel = 'stylesheet';
    document.head.appendChild(link3);

    var showSplash = function () {
        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'none';

        var logo = document.createElement('img');
        logo.src = 'https://venge.io/images/Logo.png';
        splash.appendChild(logo);
        logo.onload = function () {
            splash.style.display = 'block';
        };

        var container = document.createElement('div');
        container.id = 'progress-bar-container';
        splash.appendChild(container);

        var bar = document.createElement('div');
        bar.id = 'progress-bar';
        container.appendChild(bar);

    };

    var hideSplash = function () {
        var splash = document.getElementById('application-splash-wrapper');
        splash.parentElement.removeChild(splash);

        if(typeof PokiSDK !== 'undefined'){
            PokiSDK.gameLoadingFinished();
        }
    };

    var setProgress = function (value) {
        var bar = document.getElementById('progress-bar');
        if(bar) {
            value = Math.min(1, Math.max(0, value));
            bar.style.width = value * 100 + '%';
        }
    };

    var createCss = function () {
        var css = [
            'body {',
            '    background-color: #3a3a3a;',
            '}',
            '',
            '#application-splash-wrapper {',
            '    position: absolute;',
            '    top: 0;',
            '    left: 0;',
            '    height: 100%;',
            '    width: 100%;',
            '    background: url("https://venge.io/Thumbnail-004.jpg") no-repeat center center;',
            '    background-size: cover;',
            '}',
            '',
            '#application-splash {',
            '    position: absolute;',
            '    top: calc(50% - 100px);',
            '    width: 500px;',
            '    left: calc(50% - 250px);',
            '}',
            '',
            '#application-splash img {',
            '    width: 100%;',
            '}',
            '',
            '#progress-bar-container {',
            '    margin: 20px auto 0 auto;',
            '    height: 10px;',
            '    width: 100%;',
            '    background-color: #232323;',
            '}',
            '',
            '#progress-bar {',
            '    width: 0%;',
            '    height: 100%;',
            '    background-color: #fff;',
            '}',
            '',
            '@media (max-width: 480px) {',
            '    #application-splash {',
            '        width: 170px;',
            '        left: calc(50% - 85px);',
            '    }',
            '}'
        ].join('\n');

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    };

    createCss();
    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', hideSplash);
});

window.addEventListener('keydown', ev => {
    if (['ArrowDown', 'ArrowUp'].includes(ev.key)) {
        ev.preventDefault();
    }

    if (
        ['Tab'].includes(ev.key) && 
        document.activeElement.tagName != 'INPUT'
    ) {
        ev.preventDefault();
    }
});