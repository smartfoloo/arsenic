"use strict";

let inspectEnabled = false;

/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

class UrlInfoHelper {
  constructor() { }

  extractFavicon(url) {
    try {
      return `https://www.google.com/s2/favicons?domain=${url}&sz=24`;
    } catch (e) {
      console.log('Error fetching favicon:', e);
      return '';
    }
  }
}

const helper = new UrlInfoHelper();

function getProxyUrl(url) {
  const proxyType = localStorage.getItem('proxy-backend');

  if (proxyType === "dynamic") {
    return "/service/dynamic/" + __uv$config.encodeUrl(url);
  } else if (proxyType === "scramjet") {
    return "/service/scramjet/" + __uv$config.encodeUrl(url);
  } else {
    return "/service/uv/" + __uv$config.encodeUrl(url);
  }
  
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  const url = search(address.value, searchEngine.value);
  openProxyPage(url);
});

function inspect() {
  const targetIframe = document.querySelector('.current-game-embed');
  console.log(targetIframe);

  if (targetIframe) {
    const iframeDoc = targetIframe.contentDocument || targetIframe.contentWindow.document;

    if (inspectEnabled === false) {
      const erudaScript = document.createElement('script');
      erudaScript.src = "//cdn.jsdelivr.net/npm/eruda";
      erudaScript.onload = function () {
        const initializeScript = document.createElement('script');
        initializeScript.innerHTML = "eruda.init(); eruda.show();";
        iframeDoc.head.appendChild(initializeScript);
      };
      iframeDoc.head.appendChild(erudaScript);
      console.log('Appended Eruda Script');
    } else {
      const erudaContainer = iframeDoc.getElementById('eruda');
      if (erudaContainer) {
        erudaContainer.remove();
      }
    }

    inspectEnabled = !inspectEnabled;
  }
}

function openProxyPage(url) {
  registerSW()
    .then(() => {
      const proxyTabId = address.value.replace(/\s+/g, '-').toLowerCase();
      const tabsContainer = document.getElementById('tabs-container');
      const embedContainer = document.getElementById('embed-container');

      if (document.getElementById(`${proxyTabId}-tab`)) {
        openPage(`${proxyTabId}-embed`);
        return;
      }

      const icon = helper.extractFavicon(url);

      const newTab = document.createElement('button');
      newTab.classList.add('tab-btn');
      newTab.id = `${proxyTabId}-tab`;

      newTab.innerHTML = `
        <div class="left">
            <img src="${icon}" alt="Favicon" class="tab-favicon">
            <p>Loading...</p> <!-- Initial title while loading -->
        </div>
        <button class="close-tab" onclick="closeTab('${proxyTabId}')">
            <i class="bi bi-x-lg"></i>
        </button>
      `;

      newTab.onclick = function () { openPage(`${proxyTabId}-embed`); };

      tabsContainer.appendChild(newTab);

      const newEmbed = document.createElement('iframe');
      newEmbed.src = getProxyUrl(url);
      newEmbed.id = `${proxyTabId}-embed`;
      newEmbed.classList.add('game-embed');
      newEmbed.style.display = 'none';

      newEmbed.sandbox = "allow-same-origin allow-scripts";

      embedContainer.appendChild(newEmbed);
      newEmbed.style.display = 'block';

      const loaderContainer = document.getElementById('loader-container');

      loaderContainer.style.display = 'block';

      newEmbed.onload = () => {
        loaderContainer.style.display = 'none';
        try {
          const title = newEmbed.contentDocument.title;
          newTab.querySelector('p').textContent = title;
          console.log('Fetched title:', title);
        } catch (e) {
          console.error('Error fetching title from iframe:', e);
          newTab.querySelector('p').textContent = 'Untitled';
        }
      };

      openPage(`${proxyTabId}-embed`);
    });
}
