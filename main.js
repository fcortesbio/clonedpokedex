import * as utils from "./modules/utilities.js";
import * as fetchPkm from "./modules/fetch.js";
import * as searchPkm from "./modules/search.js"

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

// Display Pokémon
function displayPokemon(pokemon) {
  if (!pokemon) return;

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("container");

  const abilities = pokemon.abilities;

  const abilitiesDisplay = abilities
    .map(
      (ability) =>
        `<a href="https://pokemondb.net/ability/${ability.ability.name.toLowerCase()}">${capitalize(
          ability.ability.name
        )}</a>`
    )
    .join(", ");

  pokemonCard.innerHTML = `
    <h2 class="pokemon-id-name">N.º ${numPadding(pokemon.id)} - ${capitalize(pokemon.name)}</h2>
    <img class="sprite" src="${pokemon.sprites.front_default}" alt="${pokemon.name} sprite">
    <div class="type">
      ${pokemon.types.map((type) => `<div class="${type.type.name}">${capitalize(type.type.name)}</div>`).join("")}
    </div>
    <div class="abilities-list">
      <strong>Abilities:</strong>
      <p>${abilitiesDisplay}</p>
    </div>
  `;

  pokemonListContainer.appendChild(pokemonCard);
}

// Display not found
function displayNone(){
  const noResultsBox = document.createElement("section");
  noResultsBox.classList.add("no-results");

  noResultsBox.innerHTML = `
  <h2>No Pokémon was found matching with this search</h2>
  <span>Try the following to find results:</span>
  <ul>
      <li>Reduce the number of search parameters</li>
      <li>Try Pokémon types searches one by one</li>
      <li>Try looking for Pokémon of more than one size and shape</li>
  </ul>
`;
pokemonListContainer.appendChild(noResultsBox)
}


// Load Pokédex
async function loadPokedex(limit = 12, offset = 0) {
  try {
    const pokemonList = await fetchPokemonData(limit, offset);
    const pokemonDetailsPromises = pokemonList.map((pokemon) => fetchPokemon(pokemon.url));
    const pokemonData = await Promise.all(pokemonDetailsPromises);
    pokemonData.forEach(displayPokemon);

    loadMoreButton.style.display = "block";
    returnButton.style.display = "none";
  } catch (error) {
    console.error("Error loading Pokédex:", error.message);
  }
}

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

// Initial load
// loadPokedex(pokemonLoadConfig.initialLoadCount, currentOffset);
displayNone();