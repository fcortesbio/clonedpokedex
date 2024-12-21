//  loadPokedex handles the fetch and display of Pokémon data within a specified ID range.
// Used for the first load of the pokedex list

import { fetchPokemonAttributes } from "./fetchPokemonAttributes.js";
import { displayPokemonCard } from "./displayPokemonCard.js";

export async function loadPokedex(start, end) {
  try {
    const ids = Array.from({ length: end - start + 1 }, (_, i) => start + i); // Generate an array of IDs from start to end
    const pokemonData = await fetchPokemonAttributes(ids); 
    pokemonData.forEach(displayPokemonCard);
  } catch (err) {
    console.error("Error loading Pokedex:", err);
  }
}
