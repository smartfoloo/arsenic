document.addEventListener('DOMContentLoaded', function () {
  loadGames();
});

// Load games

const gameList = document.getElementById('game-list');

async function loadGames() {
  try {
    const gamesData = JSON.parse(document.getElementById('gamesData').textContent);

    gamesData.forEach(game => {
      const gameId = game.id;
      const gameCategories = game.tags.map(tag => `#${tag}`).join(' ');

      const gameHtml = `
        <a onclick="addGameTab('${gameId}', '${game.title}')" class="game-btn" data-categories="${game.tags.join(',')}">
          <img src="./images/${gameId.replace(/-/g, '')}.png" alt="${game.title}">
          <div class="content">
            <p class="title">${game.title}</p>
            <p class="category">${gameCategories}</p>
          </div>
        </a>
      `;

      gameList.innerHTML += gameHtml;
    });

    populateCategories();
    console.log("Games loaded successfully");
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

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

  embedContainer.style.display = (pageId === 'home-page' || pageId === 'settings-page' || pageId === 'game-page' || pageId === 'proxy-page' || pageId === 'forum-page') ? 'none' : 'flex';

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
  const gameEmbed = document.querySelector('iframe.game-embed');
  if (gameEmbed) {
    gameEmbed.src += '';
  }
}