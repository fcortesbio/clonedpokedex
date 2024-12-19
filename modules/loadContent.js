import { fetchPokemonAttributes } from "./fetchGQL.js";
import {} from "./utilities.js"

// Function to load a specific range of Pokémon
export async function loadPokemons(startID, endID) {
  try {
    const batchSize = endID - startID + 1;
    const pokemons = await fetchPokemonAttributes(startID, endID, batchSize);

    // Here, we would handle displaying the Pokémon
    pokemons.forEach((pokemon) => {
      displayPokemonCard(pokemon);
    });

    // Once we've loaded the initial batch, show the "Load More" button
    const actionsBox = document.getElementById("actions");
    actionsBox.innerHTML = '<button id="loadMoreButton">Load More</button>';

    const loadMoreButton = document.getElementById("loadMoreButton");
    loadMoreButton.addEventListener("click", () => loadMorePokemons(endID + 1));
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}

// Function to handle loading more Pokémon when the 'Load More' button is clicked
export function loadMorePokemons(startID) {
  const endID = startID + LOAD_MORE_COUNT - 1;
  loadPokemons(startID, endID);
}

// Display individual Pokémon data in the Pokémon list
export function displayPokemonCard(pokemon) {
  const pokemonList = document.getElementById("pokemonList");

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  pokemonCard.innerHTML = `
        <img src="${pokemon.sprite}" alt="${
    pokemon.name
  }" class="pokemon-sprite">
        <h2>${pokemon.name}</h2>
        <p><strong>ID:</strong> ${pokemon.id}</p>
        
        <div class="pokemon-types">
            <strong>Types:</strong> ${pokemon.types.join(", ")}
        </div>

        <div class="pokemon-abilities">
            <strong>Abilities:</strong> ${pokemon.abilities.join(", ")}
        </div>

        <div class="pokemon-stats">
            <strong>Stats:</strong>
            <ul>
                ${pokemon.stats
                  .map((stat) => `<li>${stat.name}: ${stat.value}</li>`)
                  .join("")}
            </ul>
        </div>

        <div class="pokemon-description">
            <strong>Description:</strong> ${pokemon.description}
        </div>
    `;

  pokemonList.appendChild(pokemonCard);
}

// Function to display detailed Pokémon data (called after search or selection)
export async function displayPokemonDetails(pokemonID) {
  try {
    const pokemonDetails = await fetchPokemonAttributes(
      pokemonID,
      pokemonID,
      1
    );
    const pokemon = pokemonDetails[0];

    // Here you could expand the data shown to the user
    displayPokemonData(pokemon);
  } catch (error) {
    console.error("Error fetching detailed Pokémon data:", error);
  }
}
