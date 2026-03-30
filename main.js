const API_BASE = '';

async function fetchMovies() {
  const response = await fetch(`${API_BASE}/movies`);
  const data = await response.json();
  if (data.ok) return data.movies;
  return [];
}

async function fetchMusic() {
  const response = await fetch(`${API_BASE}/music`);
  const data = await response.json();
  if (data.ok) return data.music;
  return [];
}

function renderMovies(movies) {
  const container = document.getElementById('movie-grid-dynamic');
  if (!container) return;
  container.innerHTML = '';

  if (!movies.length) {
    container.innerHTML = '<p style="color: var(--text-dim); text-align: center;">No movies available yet.</p>';
    return;
  }

  movies.forEach(movie => {
    const btn = document.createElement('button');
    btn.className = 'movie-link modal-trigger';
    btn.dataset.trailer = movie.trailerUrl;
    btn.setAttribute('aria-label', `Play ${movie.title} Trailer`);

    const card = document.createElement('div');
    card.className = 'movie-poster';
    card.innerHTML = `<h3>${movie.title}</h3><p>${movie.genre}</p><span class="view-btn">Play Trailer</span>`;

    if (movie.posterUrl) {
      card.style.backgroundImage = `url('${movie.posterUrl}')`;
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center';
    }

    btn.appendChild(card);
    container.appendChild(btn);
  });
}

function renderMusic(tracks) {
  const container = document.getElementById('music-track-list');
  if (!container) return;
  container.innerHTML = '';

  if (!tracks.length) {
    container.innerHTML = '<p style="color: var(--text-dim); text-align: center;">No tracks available yet.</p>';
    return;
  }

  tracks.forEach(track => {
    const div = document.createElement('div');
    div.className = 'track';
    div.innerHTML = `
      <audio src="${track.audioUrl}" preload="none"></audio>
      <div class="track-info">
        <div class="equalizer"><span></span><span></span><span></span></div>
        <div>
          <div style="font-weight: bold; font-size: 1.2rem;">${track.trackName}</div>
          <div style="font-size: 0.85rem; color: var(--text-dim);">${track.style}</div>
        </div>
      </div>
      <button class="listen-btn" aria-label="Play ${track.trackName}">LISTEN</button>
    `;
    container.appendChild(div);
  });

  if (window.setupTrackPlayers) {
    window.setupTrackPlayers();
  }
}

async function initScene() {
  const movies = await fetchMovies();
  renderMovies(movies);

  const music = await fetchMusic();
  renderMusic(music);
}

document.addEventListener('DOMContentLoaded', () => {
  initScene();
});
