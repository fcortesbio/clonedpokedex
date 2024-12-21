// Import functions from modules
import { displayPokemonCard } from "./displayPokemonCard.js";
import { fetchPokemonAttributes } from "./fetchPokemonAttributes.js";
import { fetchPokemonAttributesREST } from "./fetchPokemonAttributesREST.js";
import { fetchPokemonByQuery } from "./fetchPokemonByQuery.js";
import { processSearchInput } from "./processSearchInput.js";

// Configuration
const INITIAL_POKEMON_COUNT = 9;
let currentStartID = 1;
let currentEndID = INITIAL_POKEMON_COUNT;

const pokedexContainer = document.getElementById("pokedexContainer");
const actionsContainer = document.getElementById("actions");

function print(...content) {
  console.log(...content);
}

async function loadPokedex(start, end) {
  try {
    const ids = Array.from({ length: end - start + 1 }, (_, i) => start + i); // Generate an array of IDs from start to end
    const pokemonData = await fetchPokemonAttributes(ids); // Use fetchPokemonAttributesREST as a fallback if needed
    pokemonData.forEach(displayPokemonCard);
  } catch (error) {
    console.error("Error loading Pokedex:", error);
  }
}

// Initial Pokedex load
loadPokedex(currentStartID, currentEndID);

// LOAD MORE
const loadMoreButton = document.createElement("button");
loadMoreButton.className = "action-button";
loadMoreButton.textContent = "Load More Pokémon";
actionsContainer.appendChild(loadMoreButton);

loadMoreButton.addEventListener("click", () => {
  currentStartID += INITIAL_POKEMON_COUNT;
  currentEndID += INITIAL_POKEMON_COUNT;
  loadPokedex(currentStartID, currentEndID);
});

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Return to Pokedex button
const returnButton = document.createElement("button");
returnButton.className = "action-button";
returnButton.textContent = "Return to Pokédex";
returnButton.style.display = "none";
actionsContainer.appendChild(returnButton);

// Event listeners
searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  pokedexContainer.innerHTML = ""; // Clear Pokedex for search results
  loadMoreButton.style.display = "none"; // Hide "Load More" during search
  await processSearchInput(query); // Wait for search to complete
  returnButton.style.display = "block"; // Show "Return to Pokedex"
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchButton.click(); // Trigger search on "Enter" key
  }
});

returnButton.addEventListener("click", () => {
  console.clear(); // Clear console
  currentStartID = 1; // Reset start ID
  currentEndID = INITIAL_POKEMON_COUNT; // Reset end ID
  pokedexContainer.innerHTML = ""; // Clear Pokedex
  loadPokedex(currentStartID, currentEndID); // Reload initial Pokedex
  returnButton.style.display = "none"; // Hide "Return to Pokedex"
  loadMoreButton.style.display = "block"; // Show "Load More"
});