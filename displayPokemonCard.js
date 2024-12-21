
export function displayPokemonCard(pokemonData) {
  if (!pokemonData) return;

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("container");

  const abilities = pokemonData.abilities
    .map(ability => `<a href="https://pokemondb.net/ability/${ability.toLowerCase()}">${ability.charAt(0).toUpperCase() + ability.slice(1)}</a>`)
    .join(", ");

  const types = pokemonData.types
    .map(type => `<div class="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</div>`)
    .join("");

  const statsList = Object.entries(pokemonData)
    .filter(([key]) => ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].includes(key))
    .map(([name, value]) => `<li>${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}</li>`)
    .join("");

  pokemonCard.innerHTML = `
  <div class="card-face front">  
      <div class="pokemon-id-name"> 
          <h2 class="pokemon-id">#${pokemonData.id.toString().padStart(3, "0")}</h2>
          <h3>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h3>
      </div>
      <img src="${pokemonData['sprite-url']}" alt="Miniature of ${pokemonData.name}" class="sprite"> 
      <div class="pokemon-details">
          <div class="type">
              ${types}
          </div>
          <div class="pokemon-abilities">
              <strong>Abilities:</strong> ${abilities} 
          </div>
      </div>
  </div>
     
  <div class="card-face back">
      <div class="pokemon-id-name"> 
          <h3 class="pokemon-id"> #${pokemonData.id.toString().padStart(3, "0")} - ${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)} </h3>
      </div>
      <div class="pokemon-stats">
          <strong>Stats:</strong>
          <ul>
              ${statsList} 
          </ul>
      </div>
      <div class="pokemon-description">
          <strong>Description:</strong> ${pokemonData.description.replace(/[\n\f\r\t]/g, " ").replace(/\s+/g, " ").trim()} 
      </div>
  </div>
    `;
  pokedexContainer.appendChild(pokemonCard);
}