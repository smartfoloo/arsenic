function loadGame() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  document.body.innerHTML = `<iframe src='./assets/games/${id}' style='width: 100vw; height: 100vh; border: none;'></iframe>`;
}

async function loadPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    const imageUrl = id.replace(/-/g, '');
    document.body.style.backgroundImage = `url('./assets/images/${imageUrl}.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    const response = await fetch('./games.json');
    const games = await response.json();

    const game = games.find(g => g.id === id);
    if (game) {

      const loaderTitle = document.querySelector('h3#loader-title');
      const loaderTags = document.querySelector('h4#loader-tags');

      if (loaderTitle) loaderTitle.textContent = game.title;
      if (loaderTags) {
        const formattedTags = game.tags
          .map(tag => tag.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))
          .join(', ');
        loaderTags.textContent = formattedTags;
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', loadPage);