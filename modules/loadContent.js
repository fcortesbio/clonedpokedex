// // Load Pokédex
// import { fetchPokemonAttributes } from "./fetchGQL";
// import { parseListIds } from "./utilities.js"; 

// async function loadPokedex(limit = 12, offset = 0) {
//   try {
//     const pokedexObject = await fetchPokemonAttributes(limit, offset);
//     pokedexObject.forEach(displayPokemon);

//     loadMoreButton.style.display = "block";
//     returnButton.style.display = "none";
//   } catch (error) {
//     console.error("Error loading Pokédex:", error.message);
//   }
// }

// // Display Pokémon
// function displayPokemon(pokemon) {
//   if (!pokemon) return;

//   const pokemonCard = document.createElement("div");
//   pokemonCard.classList.add("container");

//   const abilities = pokemon.abilities;

//   const abilitiesDisplay = abilities
//     .map(
//       (ability) =>
//         `<a href="https://pokemondb.net/ability/${ability.ability.name.toLowerCase()}">${capitalize(
//           ability.ability.name
//         )}</a>`
//     )
//     .join(", ");

//   pokemonCard.innerHTML = `
//     <h2 class="pokemon-id-name">N.º ${numPadding(pokemon.id)} - ${capitalize(pokemon.name)}</h2>
//     <img class="sprite" src="${pokemon.sprites.front_default}" alt="${pokemon.name} sprite">
//     <div class="type">
//       ${pokemon.types.map((type) => `<div class="${type.type.name}">${capitalize(type.type.name)}</div>`).join("")}
//     </div>
//     <div class="abilities-list">
//       <strong>Abilities:</strong>
//       <p>${abilitiesDisplay}</p>
//     </div>
//   `;

//   pokemonListContainer.appendChild(pokemonCard);
// }

// // Display not found
// function displayNone(){
// const noResultsBox = document.createElement("section");
// noResultsBox.classList.add("no-results");

// noResultsBox.innerHTML = `
// <h2>No Pokémon was found matching with this search</h2>
// <span>Try the following to find results:</span>
// <ul>
//   <li>Reduce the number of search parameters</li>
//   <li>Try Pokémon types searches one by one</li>
//   <li>Try looking for Pokémon of more than one size and shape</li>
// </ul>
// `;
// pokemonListContainer.appendChild(noResultsBox)
// }