document.addEventListener('DOMContentLoaded', function () {
  openPage('home-page');

  const savedWallpaper = localStorage.getItem('selectedWallpaper') || 'nightfall';
  changeWallpaper(savedWallpaper);

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.setAttribute('theme', savedTheme);
  }

  if (localStorage.getItem("aboutblankEnabled") === "true") {
    let iFramed
    try {
      iFramed = window !== top
    } catch (e) {
      iFramed = true
    }
    if (!iFramed) {
      const popup = open("about:blank", "_blank")
      const document = popup.document
      const body = document.body
      const bodystyle = body.style
      const iframe = document.createElement('iframe')
      const iframestyle = iframe.style
      iframe.src = location.href
      iframestyle.top = iframestyle.bottom = iframestyle.left = iframestyle.right = 0
      iframestyle.border = iframestyle.outline = 'none'
      iframestyle.width = iframestyle.height = '100%'
      bodystyle.margin = bodystyle.padding = '0'
      document.body.appendChild(iframe)
      location.replace('https://classroom.google.com/');
    }
  }

  var tab = localStorage.getItem('tab');
  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (tabData.title) {
    document.title = tabData.title;
  }

  if (tabData.icon) {
    document.querySelector('link[rel="icon"]').href = tabData.icon;
  }

  // const selectElement = document.getElementById('tab-cloak');

  const savedTab = tabData.title;

  if (savedTab) {
    switch (savedTab) {
      case "Dashboard":
        selectElement.value = "canvas";
        break;
      case "Classes":
        selectElement.value = "google-classroom";
        break;
      case "Google":
        selectElement.value = "google";
        break;
      case "Google Drive":
        selectElement.value = "google-drive";
        break;
      case "Khan Academy":
        selectElement.value = "khan-academy";
        break;
      default:
        selectElement.value = "default";
        break;
    }
  }

  document.querySelector('.tab-link').click();

  /* selectElement.addEventListener('change', function () {
    const selectedValue = this.value;
    if (selectedValue === 'default') {
      resetTab();
    } else {
      setCloak(selectedValue);
    }
  }); */

  const proxyBackend = localStorage.getItem("proxy-backend") || 'ultraviolet';

  if (proxyBackend === "dynamic") {
    document.getElementById('proxy-status').innerHTML = `
      <p>
        Using
        <b style="color: var(--theme);">Dynamic</b>
      </p>
    `
  } else if (proxyBackend === "scramjet") {
    document.getElementById('proxy-status').innerHTML = `
      <p>
        Using
        <b style="color: var(--theme);">Scramjet</b>
      </p>
    `
  } else {
    document.getElementById('proxy-status').innerHTML = `
      <p>
        Using
        <b style="color: var(--theme);">Ultraviolet</b>
      </p>
    `
  }

  const aboutblankEnabled = localStorage.getItem('aboutblankEnabled');

  if (aboutblankEnabled === 'true' || aboutblankEnabled === '' || aboutblankEnabled === null) {
    document.getElementById('enableAboutBlank').disabled = true;
    document.getElementById('disableAboutBlank').disabled = false;
  } else {
    document.getElementById('enableAboutBlank').disabled = false;
    document.getElementById('disableAboutBlank').disabled = true;
  }

});

// Particles

let particlesActive = localStorage.getItem('particlesActive');
particlesActive = particlesActive === null ? false : particlesActive === 'true';

function loadParticles() {
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#daa8f4',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.7,
      },
      size: {
        value: 1.5,
      },
      move: {
        enable: true,
        direction: 'bottom',
        speed: 0.5,
        random: true,
        straight: false,
        out_mode: 'out',
      },
      line_linked: {
        enable: false,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: false,
        },
        onclick: {
          enable: false,
        },
      },
    },
    retina_detect: true,
  });
}

function destroyParticles() {
  const particlesDiv = document.getElementById('particles-js');
  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
    particlesDiv.innerHTML = '';
  }
}

function updateParticleLocalStorage(status) {
  localStorage.setItem('particlesActive', status);
}

document.getElementById('toggle-particles').addEventListener('change', (e) => {
  particlesActive = e.target.checked;
  if (particlesActive) {
    loadParticles();
  } else {
    destroyParticles();
  }
  updateParticleLocalStorage(particlesActive);
});

if (particlesActive) {
  document.getElementById('toggle-particles').checked = true;
  loadParticles();
} else {
  document.getElementById('toggle-particles').checked = false;
}

// Display time

/*

function displayTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  const timeString = `${formattedHours}:${minutes}:${seconds} ${period}`;
  document.getElementById('clock').textContent = timeString;
}

displayTime();
setInterval(displayTime, 1000);

*/

// Load games

const gameList = document.getElementById('game-list');

async function loadGames() {
  try {
    const response = await fetch('games.json');
    const gamesData = await response.json();

    gamesData.forEach(game => {
      const gameId = game.id;
      const gameCategories = game.tags.map(tag => `#${tag}`).join(' ');

      const gameHtml = `
        <a onclick="addGameTab('${gameId}', '${game.title}')" class="game-btn hidden" data-categories="${game.tags.join(',')}">
          <img src="./assets/images/${gameId.replace(/-/g, '')}.png" alt="${game.title}" loading="lazy">
          <div class="content">
            <p class="title">${game.title}</p>
            <p class="category">${gameCategories}</p>
          </div>
        </a>
      `;

      gameList.innerHTML += gameHtml;
    });

    populateCategories();
    console.log("hello")
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

loadGames();

// Add tags to game btn

function populateCategories() {
  gameList.querySelectorAll('.game-btn').forEach(game => {
    const categories = game.dataset.categories.split(',');
    const categoryText = categories.map(category => `#${category}`).join(' ');
    const categoryElement = game.querySelector('.category');
    if (categoryElement) {
      categoryElement.textContent = categoryText;
    }
  });
}

// Filter games

const categoryButtons = document.querySelectorAll('.category-btn');
let selectedCategories = new Set();

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;

    if (category !== 'all') {
      if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        button.classList.remove('selected-category');
      } else {
        selectedCategories.add(category);
        button.classList.add('selected-category');
      }
    } else {

      selectedCategories.clear();
      categoryButtons.forEach(btn => {
        if (btn.dataset.category !== 'all') {
          btn.classList.remove('selected-category');
        }
      });
      button.classList.remove('selected-category');
    }

    filterGames();
  });
});

function filterGames() {
  const searchTerm = searchInput.value.toLowerCase();

  gameList.querySelectorAll('.game-btn').forEach(game => {
    const gameCategories = game.dataset.categories.split(',');
    const gameTitle = game.querySelector('.title').textContent.toLowerCase();

    const matchesCategory = selectedCategories.size === 0 || Array.from(selectedCategories).every(category => gameCategories.includes(category));
    const matchesSearch = gameTitle.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      game.style.display = '';
    } else {
      game.style.display = 'none';
    }
  });
}

// Search for games

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterGames);

// Open page
let tabCounter = 1;

function openPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const embeds = document.querySelectorAll('#embed-container iframe');
  const embedContainer = document.getElementById('embed-container');

  document.querySelectorAll('.current-game-embed').forEach(element => {
    element.classList.remove('current-game-embed');
  });

  embedContainer.style.display = (pageId === 'home-page' || pageId === 'settings-page' || pageId === 'game-page' || pageId === 'proxy-page' || pageId === 'forum-page' || pageId === 'ai-page') ? 'none' : 'flex';

  pages.forEach(page => {
    page.style.display = 'none';
  });
  embeds.forEach(embed => {
    embed.style.display = 'none';
  });

  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
    selectedPage.classList.add('current-game-embed');
  }
}

// Add new tab
function addGameTab(gameId, gameName) {
  const tabsContainer = document.getElementById('tabs-container');
  const embedContainer = document.getElementById('embed-container');

  if (document.getElementById(`${gameId}-tab`)) {
    openPage(`${gameId}-embed`);
    return;
  }

  const newTab = document.createElement('button');
  newTab.classList.add('tab-btn');
  newTab.id = `${gameId}-tab`;

  newTab.innerHTML = `<div class="left"><i class="bi bi-controller"></i><p>${gameName}</p></div> <button class="close-tab" onclick="closeTab('${gameId}')"><i class="bi bi-x-lg"></i></button>`;
  newTab.onclick = function () { openPage(`${gameId}-embed`); };

  tabsContainer.appendChild(newTab);

  const newEmbed = document.createElement('iframe');
  newEmbed.src = `./assets/games/${gameId}`;
  newEmbed.id = `${gameId}-embed`;
  newEmbed.classList.add('game-embed');
  newEmbed.style.display = 'none';

  embedContainer.appendChild(newEmbed);

  openPage(`${gameId}-embed`);

  tabCounter++;
}

// Close tab
function closeTab(gameId) {
  const tab = document.getElementById(`${gameId}-tab`);
  if (tab) tab.remove();

  const embed = document.getElementById(`${gameId}-embed`);
  if (embed) embed.remove();

  document.getElementById('loader-container').style.display = "none";

  openPage('home-page');
}

// Fullscreen
const reqFs = (elem) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

const fullscreen = () => {
  const elem = document.querySelector('.current-game-embed');
  reqFs(elem);
};

// Refresh

function refresh() {
  const gameEmbed = document.querySelector('iframe.current-game-embed');
  if (gameEmbed) {
    gameEmbed.src += '';
  }
}

// AI

const chatBox = document.getElementById('chat-display');
const textInput = document.getElementById('input-box');
const sendBtn = document.getElementById('submit-btn');

const token = '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';

function sendTextMessage() {
  const message = textInput.value.trim();
  if (!message) return;

  displayMessage(message, 'user');
  textInput.value = '';

  fetchResponse(message);
}

function displayMessage(messageContent, senderType) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${senderType}`;
  messageDiv.innerHTML = `<p><b>${senderType === 'user' ? 'You' : senderType === 'ai' ? 'AI' : 'Error'}</b>: ${messageContent}</p>`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchResponse(userMessage) {
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  const systemPrompt = "You are a helpful AI assistant.";

  const requestData = {
    model: "mixtral-8x7b-32768",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    temperature: 0.9,
    max_tokens: 1024,
    stream: false
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const { choices } = await response.json();
    const reply = choices[0].message.content;
    displayMessage(reply, 'ai');
  } catch (err) {
    console.error('Request Failed:', err);
    displayMessage(`Failed to get a response. Details: ${err.message}`, 'error');
  }
}

textInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendTextMessage();
  }
});

sendBtn.addEventListener('click', sendTextMessage);

// Proxy 

const searchEngineUrls = {
  google: "https://www.google.com/search?q=%s",
  bing: "https://www.bing.com/search?q=%s",
  duckduckgo: "https://duckduckgo.com/?q=%s",
  yahoo: "https://search.yahoo.com/search?p=%s"
};

const searchEngineInput = document.getElementById("uv-search-engine");
const addressInput = document.getElementById("uv-address");

function updateUvAddress() {
  const savedSearchEngine = localStorage.getItem("search-engine");

  if (searchEngineUrls[savedSearchEngine]) {
    searchEngineInput.value = searchEngineUrls[savedSearchEngine];
    addressInput.placeholder = `Search ${savedSearchEngine.charAt(0).toUpperCase() + savedSearchEngine.slice(1)} or type a URL`;
  } else {
    searchEngineInput.value = searchEngineUrls.google;
    addressInput.placeholder = "Search Google or type a URL";
  }
}

function updateProxyStatus() {
  const proxyBackend = localStorage.getItem("proxy-backend") || 'ultraviolet';

  if (proxyBackend === "dynamic") {
    document.getElementById('proxy-status').innerHTML = `
      <p>
        Using
        <b style="color: var(--theme);">Dynamic</b>
      </p>
    `;
  } else if (proxyBackend === "scramjet") {
    document.getElementById('proxy-status').innerHTML = `
      <p>
        Using
        <b style="color: var(--theme);">Scramjet</b>
      </p>
    `;
  } else {
    document.getElementById('proxy-status').innerHTML = `
      <p>
        Using
        <b style="color: var(--theme);">Ultraviolet</b>
      </p>
    `;
  }
}

// Dropdown Handling

async function loadDropdownOptions() {
  const response = await fetch('/settings.json');
  return await response.json();
}

function createDropdownOptions(menu, options) {
  options.forEach(option => {
    const li = document.createElement('li');
    li.textContent = option.name;
    li.setAttribute('value', option.value);
    menu.appendChild(li);
  });
}

function initializeDropdown(dropdownId, localStorageKey, defaultValue, callback, options) {
  const dropdown = document.getElementById(dropdownId);
  const button = dropdown.querySelector('.dropdown-button');
  const menu = dropdown.querySelector('.dropdown-menu');
  const selected = dropdown.querySelector('.dropdown-selected');

  const savedValue = localStorage.getItem(localStorageKey) || defaultValue;
  const selectedOption = options.find(option => option.value === savedValue) || {};
  selected.textContent = selectedOption.name || savedValue;

  button.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });

  menu.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      const selectedValue = event.target.getAttribute('value');
      const selectedName = event.target.textContent;
      selected.textContent = selectedName;
      localStorage.setItem(localStorageKey, selectedValue);
      callback(selectedValue);
      menu.style.display = 'none';
    }
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      menu.style.display = 'none';
    }
  });
}

async function initializeAllDropdowns() {
  const options = await loadDropdownOptions();
  for (const dropdownId in options) {
    const dropdownOptions = options[dropdownId];
    let callback;

    if (dropdownId === 'proxy-backend') {
      callback = setProxy;
    } else if (dropdownId === 'search-engine') {
      callback = saveSearchEngine;
    } else if (dropdownId === 'tab-cloak') {
      callback = saveTabCloak;
    }

    initializeDropdown(dropdownId, dropdownId, dropdownOptions[0].value, callback, dropdownOptions);

    const menu = document.getElementById(dropdownId).querySelector('.dropdown-menu');
    createDropdownOptions(menu, dropdownOptions);
  }
}

initializeAllDropdowns();

function setProxy(value) {
  console.log(`Selected proxy: ${value}`);
  updateProxyStatus();
}

function saveSearchEngine(value) {
  console.log(`Selected search engine: ${value}`);
  updateUvAddress();
}

function saveTabCloak(value) {
  if (value === 'default') {
    resetTab();
  } else {
    setCloak(value);
  }
}

// Settings page

function openTab(evt, tabName) {
  const tabContent = document.getElementsByClassName('tab-content');
  const tabLinks = document.getElementsByClassName('tab-link');

  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = 'none';
  }

  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove('tab-active');
  }

  document.getElementById(tabName).style.display = 'flex';
  evt.currentTarget.classList.add('tab-active');
}

// Wallpapers

function changeWallpaper(color) {
  const mainContent = document.getElementById('main-content');
  mainContent.style.backgroundImage = `url('./assets/wallpapers/${color}.webp')`;
  localStorage.setItem('selectedWallpaper', color);

  const wallpaperCards = document.querySelectorAll('.wallpaper-card');
  wallpaperCards.forEach(card => {
    card.classList.remove('selected');
    const cardText = card.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '-');
    if (cardText === color) {
      card.classList.add('selected');
    }
  });
}

// about:blank Cloak

if (localStorage.getItem('aboutblankEnabled') === null) {
  localStorage.setItem('aboutblankEnabled', 'false');
}

function enableAboutBlank() {
  localStorage.setItem('aboutblankEnabled', 'true');
  location.reload();
}

function disableAboutBlank() {
  localStorage.setItem('aboutblankEnabled', 'false');
  location.reload();
}

// Tab cloak

var tab = localStorage.getItem("tab");

if (tab) {
  try {
    var tabData = JSON.parse(tab);
  } catch {
    var tabData = {};
  }
} else {
  var tabData = {};
}

var settingsDefaultTab = {
  title: "arsenic",
  icon: "./assets/favicon.png",
};

function setTitle(title = "") {
  if (title) {
    document.title = title;
  } else {
    document.title = settingsDefaultTab.title;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (title) {
    tabData.title = title;
  } else {
    delete tabData.title;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setFavicon(icon) {
  if (icon) {
    document.querySelector("link[rel='icon']").href = icon;
  } else {
    document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  }

  var tab = localStorage.getItem("tab");

  if (tab) {
    try {
      var tabData = JSON.parse(tab);
    } catch {
      var tabData = {};
    }
  } else {
    var tabData = {};
  }

  if (icon) {
    tabData.icon = icon;
  } else {
    delete tabData.icon;
  }

  localStorage.setItem("tab", JSON.stringify(tabData));
}

function setCloak(cloak) {
  switch (cloak) {
    case "canvas":
      setTitle("Dashboard");
      setFavicon("./assets/tab-logos/canvas.png");
      location.reload();
      break;
    case "google-classroom":
      setTitle("Classes");
      setFavicon("./assets/tab-logos/classroom.png");
      location.reload();
      break;
    case "google":
      setTitle("Google");
      setFavicon("./assets/tab-logos/google.ico");
      location.reload();
      break;
    case "google-drive":
      setTitle("Google Drive");
      setFavicon("./assets/tab-logos/googledrive.png");
      location.reload();
      break;
    case "khan-academy":
      setTitle("Khan Academy");
      setFavicon("./assets/tab-logos/khanacademy.png");
      location.reload();
      break;
  }
}

function resetTab() {
  document.title = settingsDefaultTab.title;
  document.querySelector("link[rel='icon']").href = settingsDefaultTab.icon;
  localStorage.setItem("tab", JSON.stringify({}));
}

/*
// Download Static Files

document.getElementById('downloadFiles').addEventListener('click', function () {
  window.location.href = '/download-static-files';
});

*/


// Themes

function setTheme(theme) {
  document.body.setAttribute('theme', theme);
  localStorage.setItem('theme', theme);
}

// Credits

const _0x5c36c7 = _0x4905; (function (_0x11fed3, _0x29adf3) { const _0xfe6445 = _0x4905, _0x2752d2 = _0x11fed3(); while (!![]) { try { const _0x40b3a4 = -parseInt(_0xfe6445(0x17c)) / 0x1 * (-parseInt(_0xfe6445(0x190)) / 0x2) + -parseInt(_0xfe6445(0x181)) / 0x3 + parseInt(_0xfe6445(0x182)) / 0x4 + parseInt(_0xfe6445(0x189)) / 0x5 + -parseInt(_0xfe6445(0x17d)) / 0x6 * (-parseInt(_0xfe6445(0x18b)) / 0x7) + -parseInt(_0xfe6445(0x18f)) / 0x8 * (parseInt(_0xfe6445(0x187)) / 0x9) + parseInt(_0xfe6445(0x18d)) / 0xa * (-parseInt(_0xfe6445(0x17a)) / 0xb); if (_0x40b3a4 === _0x29adf3) break; else _0x2752d2['push'](_0x2752d2['shift']()); } catch (_0x4fb83d) { _0x2752d2['push'](_0x2752d2['shift']()); } } }(_0x4664, 0x9202a)); const creditsList = document[_0x5c36c7(0x17e)](_0x5c36c7(0x188)); async function loadCredits() { const _0x150751 = _0x5c36c7; try { const _0x43015f = await fetch(_0x150751(0x18a)), _0x47e6a3 = await _0x43015f[_0x150751(0x180)](); _0x47e6a3[_0x150751(0x17b)](_0xd1b73b => { const _0x4eb457 = _0x150751, _0x13b1bf = '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22credit-card\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<img\x20src=\x22./assets/credits/' + _0xd1b73b[_0x4eb457(0x184)] + _0x4eb457(0x185) + _0xd1b73b['name'] + _0x4eb457(0x179) + _0xd1b73b[_0x4eb457(0x184)] + _0x4eb457(0x178) + _0xd1b73b[_0x4eb457(0x191)] + _0x4eb457(0x186); creditsList[_0x4eb457(0x18e)] += _0x13b1bf; }), console[_0x150751(0x183)](_0x150751(0x17f)); } catch (_0x8af039) { console['error'](_0x150751(0x18c), _0x8af039); } } function _0x4905(_0x3f8123, _0x51cccf) { const _0x46646d = _0x4664(); return _0x4905 = function (_0x490515, _0x281e90) { _0x490515 = _0x490515 - 0x178; let _0x437ea5 = _0x46646d[_0x490515]; return _0x437ea5; }, _0x4905(_0x3f8123, _0x51cccf); } function _0x4664() { const _0x27621b = ['json', '2532525vKBRLh', '1075380UWKkdE', 'log', 'user', '.webp\x22\x20alt=\x22\x22\x20class=\x22credit-pfp\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<b>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>', '</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20', '441YwIIHI', 'credits-container', '4989685aVyEBI', './assets/credits/data.json', '2534PVuuLy', 'Error\x20loading\x20credits:', '16649060PeKxwN', 'innerHTML', '10064PSwcAl', '5162MRnjUx', 'desc', '</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p>', '</p>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</b>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<p\x20class=\x22discord-user\x22>', '11IfcfHX', 'forEach', '417NzgaIE', '13686kqoVbw', 'getElementById', 'hello']; _0x4664 = function () { return _0x27621b; }; return _0x4664(); } loadCredits();

// Load animation.js after

function loadScriptWithDelay(url, delay) {
  setTimeout(() => {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
  }, delay);
}

loadScriptWithDelay('./js/animation.js', 200);

// Cookies

function prepareCookieSave() {
  var cookieSave = {};
  cookieData = document.cookie;
  cookieData = btoa(cookieData);
  cookieSave.cookies = cookieData;
  cookieSave = btoa(JSON.stringify(cookieSave));
  cookieSave = CryptoJS.AES.encrypt(cookieSave, "cookieSecretKey").toString();
  return cookieSave;
}

function triggerDownload() {
  Swal.fire({
    title: "Warning!",
    html: "This save file may include <strong>very sensitive information</strong> such as your Discord token. \n Sharing this save file with anyone will give them access to any and all accounts you have signed into using the proxy.",
    showCancelButton: true,
    confirmButtonText: "Download",
    icon: "warning"
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Downloaded", "<i>Don't share this file with anyone</i>", "success");
      var saveData = new Blob([prepareCookieSave()]);
      var saveURL = URL.createObjectURL(saveData);
      var fakeLink = document.createElement("a");
      fakeLink.href = saveURL;
      fakeLink.download = "cookies.save";
      fakeLink.click();
      URL.revokeObjectURL(saveURL);
    }
  });
}

function processUpload(data, key) {
  if (key) {
    data = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
  } else {
    data = CryptoJS.AES.decrypt(data, "cookieSecretKey").toString(CryptoJS.enc.Utf8);
  }
  var cookieSave = JSON.parse(atob(data));
  var cookieData = atob(cookieSave.cookies);
  document.cookie = cookieData;
}

function uploadMainSave(key) {
  var hiddenInput = document.querySelector(".hiddenUpload");
  hiddenInput.click();
  hiddenInput.addEventListener("change", function (event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      if (key) {
        processUpload(e.target.result, key);
      } else {
        processUpload(e.target.result);
      }
      alert("Upload Successful!");
    };
    reader.readAsText(file);
  });
}

document.getElementById("downloadSave").addEventListener("click", triggerDownload);