// Configuration
let currentOffset = 0;
const pokemonLoadConfig = {
  initialLoadCount: 12, // Number of Pokémon loaded during the initial run
  loadMoreCount: 12 // Number of Pokémon to load when using Load More Pokémon
};

// DOM elements reference
const pokemonListContainer = document.getElementById("pokemonList");
const actionsContainer = document.getElementById("actions");

const loadMoreButton = document.createElement("button");
loadMoreButton.className = "action-button";
loadMoreButton.textContent = "Load More Pokémon";

const returnButton = document.createElement("button");
returnButton.className = "action-button";
returnButton.textContent = "Return to Pokédex";
returnButton.style.display = "none"; // Initially hidden

actionsContainer.appendChild(loadMoreButton);
actionsContainer.appendChild(returnButton);

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Event listeners
loadMoreButton.addEventListener("click", async () => {
  currentOffset += pokemonLoadConfig.loadMoreCount;
  await loadPokedex(pokemonLoadConfig.loadMoreCount, currentOffset);
});

returnButton.addEventListener("click", () => {
  currentOffset = 0;
  pokemonListContainer.innerHTML = "";
  loadPokedex(pokemonLoadConfig.initialLoadCount, currentOffset);
});

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  processSearchInput(query);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();
    processSearchInput(query);
  }
});

