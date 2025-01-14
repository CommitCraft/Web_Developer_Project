const API_URL = "https://itunes.apple.com/search?term=";

// DOM elements
const loader = document.getElementById("loader");
const musicList = document.getElementById("musicList");
const playerContainer = document.getElementById("playerContainer");
const trackTitle = document.getElementById("trackTitle");
const musicPlayer = document.getElementById("musicPlayer");
const trackSource = document.getElementById("trackSource");
const closePlayer = document.getElementById("closePlayer");

// Search button click event
document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    fetchMusic(query);
  }
});

// Fetch music data
async function fetchMusic(query) {
  try {
    loader.classList.remove("hidden"); // Show loader

    const response = await fetch(`${API_URL}${query}&limit=10`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    loader.classList.add("hidden"); // Hide loader

    if (data && data.results.length > 0) {
      displayMusic(data.results);
    } else {
      alert("No results found. Please try another search.");
    }
  } catch (error) {
    loader.classList.add("hidden"); // Hide loader
    console.error("Error fetching music data:", error);
    alert("Failed to fetch music data. Please try again later.");
  }
}

// Display music tracks
function displayMusic(tracks) {
  musicList.innerHTML = ""; // Clear previous results

  tracks.forEach((track) => {
    const card = document.createElement("div");
    card.classList.add("music-card");

    card.innerHTML = `
      <img src="${track.artworkUrl100}" alt="${track.trackName}">
      <h3>${track.trackName}</h3>
      <p>${track.artistName}</p>
    `;

    card.addEventListener("click", () => playTrack(track)); // Play track on click
    musicList.appendChild(card);
  });
}

// Play selected track
function playTrack(track) {
  trackTitle.textContent = `${track.trackName} by ${track.artistName}`;
  trackSource.src = track.previewUrl;
  musicPlayer.load();
  playerContainer.classList.remove("hidden"); // Show player
}

// Close player
closePlayer.addEventListener("click", () => {
  playerContainer.classList.add("hidden");
  musicPlayer.pause(); // Stop playback
});
