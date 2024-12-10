function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function numPadding(number) {
  return number > 999 ? number.toString() : number.toString().padStart(3, "0");
}

const pokemonLoadConfig = {
  initialLoadCount: 12, // Number of Pokémon loaded during the initial run
  loadMoreCount: 12 // Number of Pokémon to load when using Load More Pokémon
};

let currentOffset = 0;

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

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Data for Pokémon could not be fetched");
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function fetchPokemonData(limit = 5, offset = 0) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error("Data could not be fetched");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function fetchPokemonByType(type) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) throw new Error("Type not found, please try again.");
    const data = await response.json();
    return data.pokemon.map((item) => item.pokemon.name);
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function loadPokedex(limit = 12, offset = 0) {
  try {
    const pokemonList = await fetchPokemonData(limit, offset);
    const pokemonDetailsPromises = pokemonList.map((pokemon) => fetchPokemonDetails(pokemon.url));
    const pokemonData = await Promise.all(pokemonDetailsPromises);
    pokemonData.forEach(displayPokemon);

    loadMoreButton.style.display = "block";
    returnButton.style.display = "none";
  } catch (error) {
    console.error("Error loading Pokedex:", error.message);
  }
}

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

// Event listener for Load More button
loadMoreButton.addEventListener("click", async () => {
  currentOffset += pokemonLoadConfig.loadMoreCount;
  await loadPokedex(pokemonLoadConfig.loadMoreCount, currentOffset);
});

// Event listener for Return to Pokédex button
returnButton.addEventListener("click", () => {
  currentOffset = 0;
  pokemonListContainer.innerHTML = "";
  loadPokedex(pokemonLoadConfig.initialLoadCount, currentOffset);
});

// Parse and process search input
async function processSearchInput(query) {
  pokemonListContainer.innerHTML = ""; // Clear the current list

  const inputs = query.split(",").map((input) => input.trim());
  let pokemonIds = [];
  let pokemonNames = [];
  let typeFilter = null;
  let rangeFilter = null;

  // Parse inputs
  inputs.forEach((input) => {
    if (input.startsWith("type:")) {
      typeFilter = input.split(":")[1].trim();
    } else if (input.startsWith("range:")) {
      const [_, start, end] = input.split(" ");
      rangeFilter = { start: parseInt(start), end: parseInt(end) };
    } else if (!isNaN(input)) {
      pokemonIds.push(parseInt(input));
    } else {
      pokemonNames.push(input.toLowerCase());
    }
  });

  // Fetch by type if needed
  let typeResults = [];
  if (typeFilter) {
    typeResults = await fetchPokemonByType(typeFilter);
  }

  // Combine range and type results if both exist
  if (rangeFilter) {
    typeResults = typeResults.filter(
      (_, index) => index >= rangeFilter.start && index < rangeFilter.end
    );
  }

  // Fetch and display Pokémon details
  const pokemonDetailsPromises = [
    ...pokemonIds.map((id) => fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}`)),
    ...pokemonNames.map((name) => fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name}`)),
    ...typeResults.map((name) => fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name}`))
  ];

  const pokemonData = await Promise.all(pokemonDetailsPromises);
  pokemonData.forEach(displayPokemon);

  loadMoreButton.style.display = "none";
  returnButton.style.display = "block";
}

// Search Pokémon functionality
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  processSearchInput(query);
});

// Execute initial load of Pokédex
loadPokedex(pokemonLoadConfig.initialLoadCount, currentOffset);
