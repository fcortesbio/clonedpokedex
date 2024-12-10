// Utilities
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function numPadding(number) {
  return number > 999 ? number.toString() : number.toString().padStart(3, "0");
}

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

// Fetch data and search
async function fetchPokemon(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Pokémon data.");
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function fetchPokemonData(limit = 5, offset = 0) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error("Failed to fetch Pokémon list.");
    const data = await response.json();
    return data.results; // returns an object as follows: n:{name:"name", url, "url"}, where n is each element in the fetched range
  } catch (error) {
    console.error(error.message);
    return []; 
  }
}

async function fetchPokemonByType(type) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) throw new Error("Type not found.");
    const data = await response.json();
    return data.pokemon.map((item) => item.pokemon.name);
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

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

// Search and filter Pokémon
async function processSearchInput(query) {
  // Clear the Pokédex list when a search is requested
  pokemonListContainer.innerHTML = "";

  // Split the query into individual parameters using "&"
  const inputs = query.split("&").map((input) => input.trim());
  console.log("Inputs:", inputs);

  let pokemonIds = [];
  let pokemonNames = [];
  let typeFilter = null;
  let rangeFilter = { start: null, end: null };

  // Parse inputs
  inputs.forEach((input) => {
    if (input.startsWith("type:")) {
      typeFilter = input.split(":")[1].trim();
    } 
    else if (input.startsWith("range:")) {
      const rangeMatch = input.match(/\[([0-9]+)-([0-9]+)\]/);
      if (rangeMatch) {
        rangeFilter.start = parseInt(rangeMatch[1], 10);
        rangeFilter.end = parseInt(rangeMatch[2], 10);
      } else {
        console.error("Invalid range format. Use range:[start-end]");
      }
    } 
    else if (!isNaN(input)) {
      pokemonIds.push(parseInt(input, 10));
    } 
    else {
      pokemonNames.push(input.toLowerCase());
    }
  });

  console.log("Parsed Filters:");
  console.log("Type Filter:", typeFilter);
  console.log("Range Filter:", rangeFilter);
  console.log("Pokemon IDs:", pokemonIds);
  console.log("Pokemon Names:", pokemonNames);

  // Fetch Pokémon by type if needed
  let typeResults = [];
  if (typeFilter) {
    typeResults = await fetchPokemonByType(typeFilter);
  }

  // Handle range filter
  let rangeResults = [];
  if (rangeFilter.start !== null && rangeFilter.end !== null) {
    const offset = rangeFilter.start - 1;
    const limit = rangeFilter.end - rangeFilter.start + 1;
    console.log("offset-limit:", offset,"-", limit)
    const rangeData = await fetchPokemonData(limit, offset);
    rangeResults = rangeData.map((pokemon) => pokemon.name);
  }

  // Combine all search terms
  const allPokemonNames = new Set([
    ...typeResults,
    ...rangeResults,
    ...pokemonNames,
    ...pokemonIds.map((id) => id.toString())
  ]);

  console.log("All Pokémon Names/IDs:", Array.from(allPokemonNames));

  // Fetch and display Pokémon details
  const pokemonDetailsPromises = Array.from(allPokemonNames).map((nameOrId) =>
    fetchPokemon(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
  );

  const pokemonData = await Promise.all(pokemonDetailsPromises);
  pokemonData.forEach(displayPokemon);

  // Update button visibility
  loadMoreButton.style.display = "none";
  returnButton.style.display = "block";
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
loadPokedex(pokemonLoadConfig.initialLoadCount, currentOffset);