document.addEventListener('DOMContentLoaded', function () {
  openPage('home-page'); 

  const savedWallpaper = localStorage.getItem('selectedWallpaper') || 'blue';
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

  const selectElement = document.getElementById('tab-cloak');

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

  selectElement.addEventListener('change', function () {
    const selectedValue = this.value;
    if (selectedValue === 'default') {
      resetTab();
    } else {
      setCloak(selectedValue);
    }
  });
});

// Display time
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
          <img src="./assets/images/${gameId.replace(/-/g, '')}.png" alt="${game.title}">
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

function filterGames() {
  const selectedCategory = categoryFilter.value.toLowerCase();
  const searchTerm = searchInput.value.toLowerCase();

  gameList.querySelectorAll('.game-btn').forEach(game => {
    const gameCategories = game.dataset.categories.split(',');
    const gameTitle = game.querySelector('.title').textContent.toLowerCase();

    const matchesCategory = selectedCategory === 'all' || gameCategories.includes(selectedCategory);
    const matchesSearch = gameTitle.includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      game.style.display = '';
    } else {
      game.style.display = 'none';
    }
  });
}


// Event listener for category filter

const categoryFilter = document.getElementById('category-filter');
categoryFilter.addEventListener('change', function () {
  const selectedCategory = this.value;
  filterGames(selectedCategory);
});

// Search for games

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', filterGames);

// Open page
let tabCounter = 1;

function openPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const embeds = document.querySelectorAll('#embed-container iframe');
  const embedContainer = document.getElementById('embed-container');

  embedContainer.style.display = (pageId === 'home-page' || pageId === 'settings-page') ? 'none' : 'block';

  pages.forEach(page => {
    page.style.display = 'none';
  });
  embeds.forEach(embed => {
    embed.style.display = 'none';
  });

  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
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
  const elem = document.getElementsByClassName("game-embed")[0];
  reqFs(elem);
};

// Refresh

function refresh() {
  const gameEmbed = document.querySelector('iframe.game-embed');
  if (gameEmbed) {
    gameEmbed.src += '';
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

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.tab-link').click();
});

// Wallpapers

function changeWallpaper(color) {
  const mainContent = document.getElementById('main-content');
  mainContent.style.backgroundImage = `url('./assets/${color}.png')`;
  localStorage.setItem('selectedWallpaper', color);

  const wallpaperCards = document.querySelectorAll('.wallpaper-card');
  wallpaperCards.forEach(card => {
    card.classList.remove('selected');
    if (card.querySelector('h4').textContent.toLowerCase() === color) {
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

const aboutblankEnabled = localStorage.getItem('aboutblankEnabled');

if (aboutblankEnabled === 'true' || aboutblankEnabled === '' || aboutblankEnabled === null) {
  document.getElementById('enableAboutBlank').disabled = true;
  document.getElementById('disableAboutBlank').disabled = false;
} else {
  document.getElementById('enableAboutBlank').disabled = false;
  document.getElementById('disableAboutBlank').disabled = true;
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

// Themes

function setTheme(theme) {
  document.body.setAttribute('theme', theme);
  localStorage.setItem('theme', theme);
}

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
  var saveData = new Blob([prepareCookieSave()]);
  var saveURL = URL.createObjectURL(saveData);
  var fakeLink = document.createElement("a");
  fakeLink.href = saveURL;
  fakeLink.download = "cookies.save";
  fakeLink.click();
  URL.revokeObjectURL(saveURL);
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