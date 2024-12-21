// Configuration
const INITIAL_POKEMON_COUNT = 9;
let currentStartID = 1;
let currentEndID = INITIAL_POKEMON_COUNT;

const pokedexContainer = document.getElementById("pokedexContainer");
const actionsContainer = document.getElementById("actions");

function print(...content) {
  console.log(...content);
}

function removeScapeCharacters(input) {
  return input
    .replace(/[\n\f\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function removeWhiteSpace(input) {
  return input.replace(/\s+/g, "");
}

function kebabCase(text) { // this was never used
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-");
}

function leadingZeros(n, length = 3) { // used for padding numbers on displayPokemonCard
  return n.toString().padStart(length, "0");
}

function parseRange(range) { // used for parsing range queries in search
  try {
    let [start, end] = range.split(":").map(Number);
    if (start && end && start <= end) {
      return [start, end];
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

function parseListIds(numbers) { // used for parsing list queries in search 
  if (!Array.isArray(numbers) || numbers.length === 0) return [];

  const sortedNumbers = [...new Set(numbers)].sort((a, b) => a - b);
  const result = [];
  let tempGroup = [sortedNumbers[0]];

  for (let i = 1; i < sortedNumbers.length; i++) {
    const current = sortedNumbers[i];
    const previous = sortedNumbers[i - 1];

    if (current === previous + 1) {
      tempGroup.push(current);
    } else {
      result.push(tempGroup.length === 1 ? tempGroup[0] : [...tempGroup]);
      tempGroup = [current];
    }
  }
  result.push(tempGroup.length === 1 ? tempGroup[0] : [...tempGroup]);

  return result;
}

//
// FETCH DATA
//

async function fetchGraphQL(query, variables) {
  // console.log("GraphQL Query:", query);
  // console.log("GraphQL Variables:", variables);

  try {
    const result = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variables: variables,
        query: query,
      }),
    });

    const response = await result.json();
    if (response.errors) {
      throw new Error(
        "GraphQL Error: " + response.errors.map((e) => e.message).join(", ")
      );
    }
    return response;
  } catch (error) {
    console.error("GraphQL fetch failed, falling back to REST API:", error);
    // If GraphQL fails, fallback to REST
    return null;
  }
}

async function fetchPokemonAttributes(startId, endId, batchSize = 20) {
  const pokemonData = [];
  endId = endId || startId;

  console.log(
    endId === startId
      ? `Fetching data for Pokémon ID=${endId}`
      : `Fetching data for Pokémon from ID=${startId} to ID=${endId}`
  );

  const query = `
    query pokemon_details($startId: Int!, $endId: Int!) {
      pokemon_v2_pokemon(where: { id: { _gte: $startId, _lte: $endId } }) {
        id
        name
        types: pokemon_v2_pokemontypes {
          type: pokemon_v2_type {
            name
          }
        }
        stats: pokemon_v2_pokemonstats {
          base_stat
          stat: pokemon_v2_stat {
            name
          }
        }
        abilities: pokemon_v2_pokemonabilities {
          ability: pokemon_v2_ability {
            name
          }
        }
        species: pokemon_v2_pokemonspecy {
          flavor_text: pokemon_v2_pokemonspeciesflavortexts(where: { language_id: { _eq: 9 } }, limit: 1) {
            flavor_text
          }
        }
        sprites: pokemon_v2_pokemonsprites {
          sprites(path: "front_default")
        }
      }
    }
  `;

  try {
    for (let i = startId; i <= endId; i += batchSize) {
      const batchStart = i;
      const batchEnd = Math.min(i + batchSize - 1, endId);
      console.log(`Fetching batch: ID ${batchStart} to ${batchEnd}`);

      const response = await fetchGraphQL(query, {
        startId: batchStart,
        endId: batchEnd,
      });
      console.log(response)

      // // If GraphQL fails, fallback to REST API
      // if (!response) {
      //   const restData = await fetchREST(batchStart, batchEnd, batchSize);
      //   pokemonData.push(...restData);
      // } else {

      const { data } = response;
      if (data && data.pokemon_v2_pokemon) {
        for (const pokemon of data.pokemon_v2_pokemon) {
          const filteredData = {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map((typeData) => typeData.type.name),
            stats: pokemon.stats.map((statData) => ({
              name: statData.stat.name,
              value: statData.base_stat,
            })),
            abilities: pokemon.abilities.map(
              (abilityData) => abilityData.ability.name
            ),
            description:
              pokemon.species?.flavor_text?.[0]?.flavor_text ||
              "No description available.",
            sprite: pokemon.sprites?.[0]?.sprites || null,
          };
          pokemonData.push(filteredData);
        }
      } else {
        console.error(
          `No data returned for batch ID=${batchStart} to ID=${batchEnd}`
        );
      }
    }
  // }
  } catch (error) {
  console.error("Error fetching Pokémon data:", error);
}

return pokemonData;
}

// async function fetchREST(startId, endId, batchSize = 20) {
//   if (startId > endId) {
//     throw new Error(
//       `Invalid input: startId (${startId}) cannot be greater than endId (${endId}).`
//     );
//   }

//   const pokemonData = [];
//   let offset = startId - 1;
//   endId = endId || startId;

//   console.log(
//     `[INFO] ${startId === endId
//       ? `Fetching data for Pokemon ID=${startId}`
//       : `Fetching data from ID=${startId} to ID=${endId}`
//     }`
//   );

//   while (offset < endId) {
//     const limit = Math.min(batchSize, endId - offset);
//     const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

//     try {
//       const data = await fetchWithRetry(url);

//       const detailRequests = data.results.map(async (pokemon) => {
//         try {
//           const pokemonDetails = await fetchWithRetry(pokemon.url);
//           return {
//             id: pokemonDetails.id,
//             name: pokemonDetails.name,
//             types: pokemonDetails.types.map((typeData) => typeData.type.name),
//           };
//         } catch (error) {
//           console.error(`Error fetching details for ${pokemon.name}:`, error);
//           return null;
//         }
//       });

//       const fetchedDetails = await Promise.all(detailRequests);
//       pokemonData.push(...fetchedDetails.filter(Boolean));
//     } catch (error) {
//       console.error(`Error fetching batch at offset ${offset}:`, error);
//     }

//     offset += limit;
//   }

//   return pokemonData;
// }

// async function fetchWithRetry(url, retries = 3) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url);
//       if (!response.ok)
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       return await response.json();
//     } catch (error) {
//       console.warn(`Retry ${i + 1}/${retries} for ${url}`);
//     }
//   }
//   throw new Error(`Failed to fetch after ${retries} attempts: ${url}`);
// }

//
// DISPLAY POKEMON
//

async function loadPokedex(start, end) {
  try {
    const pokemonArray = await fetchPokemonAttributes(start, end);
    const pokemonDataPromises = pokemonArray.map(pokemon => unpackPokemonData(pokemon));
    const pokemonData = await Promise.all(pokemonDataPromises);
    pokemonData.forEach(displayPokemonCard);
  } catch (error) {
    console.error("Error loading Pokedex:", error);
  }
}

loadPokedex(currentStartID, currentEndID)

function unpackPokemonData(pokemon) {
  const pokemonData = {
    id: leadingZeros(pokemon.id),
    name: capitalize(pokemon.name),
    types: pokemon.types,
    description: removeScapeCharacters(pokemon.description),
    abilities: pokemon.abilities,
    'sprite-url': pokemon.sprite
  }
  const stats = pokemon.stats;
  for (const key in stats) {
    const stat = stats[key];
    pokemonData[stat.name] = stat.value;
  }
  return pokemonData;
}

function displayPokemonCard(pokemonData) {
  if (!pokemonData) return;

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("container");

  const abilities = pokemonData.abilities
    .map(ability => `<a href="https://pokemondb.net/ability/${ability.toLowerCase()}">${capitalize(ability)}</a>`)
    .join(", ");

  const types = pokemonData.types
    .map(type => `<div class="${type}">${capitalize(type)}</div>`)
    .join("");

  // Stats list using the unpacked stat values
  const statsList = Object.entries(pokemonData)
    .filter(([key]) => ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].includes(key))
    .map(([name, value]) => `<li>${capitalize(name)}: ${value}</li>`)
    .join("");

  pokemonCard.innerHTML = `
<div class="card-face front">  
    <div class="pokemon-id-name"> 
        <h2 class="pokemon-id">#${pokemonData.id}</h2>
        <h3>${pokemonData.name}</h3>
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
        <h3 class="pokemon-id"> #${pokemonData.id} - ${pokemonData.name} </h3>
    </div>
    <div class="pokemon-stats">
        <strong>Stats:</strong>
        <ul>
            ${statsList} 
        </ul>
    </div>
    <div class="pokemon-description">
        <strong>Description:</strong> ${pokemonData.description} 
    </div>
</div>
    
  `;
  pokedexContainer.appendChild(pokemonCard);
}

// LOAD MORE
const loadMoreButton = document.createElement("button");
loadMoreButton.className = "action-button";
loadMoreButton.textContent = "Load More Pokémon";
actionsContainer.appendChild(loadMoreButton);

loadMoreButton.addEventListener("click", () => {
  currentStartID += INITIAL_POKEMON_COUNT;
  currentEndID += INITIAL_POKEMON_COUNT; // Update currentEndID as well
  loadPokedex(currentStartID, currentEndID);
});

// 
// SEARCH POKEMON
// 

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Return to Pokedex button
const returnButton = document.createElement("button");
returnButton.className = "action-button";
returnButton.textContent = "Return to Pokédex";
returnButton.style.display = "none"; // hidden during first load
actionsContainer.appendChild(returnButton);

// Event listeners
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

returnButton.addEventListener("click", () => {
  returnButton.style.display = "none";
  pokedexContainer.innerHTML = "";
  loadPokedex(currentStartID, currentEndID);
});


// Here's the search logic
async function processSearchInput(query) {
  console.clear();
  if (!query) { // Query can't be empty
    alert("Please enter a valid search query.");
    return;
  }

  const sections = query.split(",").map((section) => section.trim()); // Sub-queries split by commas
  print("query sections:", sections);
  const allPIDs = new Set(); // Use a Set to avoid duplicates
  print("allPIDs:", allPIDs);

  for (const section of sections) {
    const input = removeWhiteSpace(section).toLowerCase(); // 
    // Remove whitespace and convert to lowercase
    print(`current section: $input`)
    if (!isNaN(input)) {
      // Direct ID search
      allPIDs.add(Number(input));
    } else if (input.includes(":")) {
      const rangeIDs = parseRange(input);
      rangeIDs.forEach((id) => allPIDs.add(id));
    } else if (input.includes("type:") || input.includes("ability:")) {
      const [keyword, value] = input.split(":").map((s) => s.trim());
      const ids = await fetchByKeyword(keyword, value);
      ids.forEach((id) => allPIDs.add(id));
    } else {
      // Name search
      const ids = await fetchByName(input);
      ids.forEach((id) => allPIDs.add(id));
    }
  }

  const finalIDs = Array.from(allPIDs).sort((a, b) => a - b);
  if (finalIDs.length === 0) {
    alert("No Pokémon matched your search query.");
    return;
  }

  displaySearchResults(finalIDs);
}

async function displaySearchResults(ids) {
  pokedexContainer.innerHTML = ""; // Clear the current display
  const pokemonData = await fetchPokemonAttributes(ids[0], ids[ids.length - 1]);

  pokemonData
    .filter((pokemon) => ids.includes(pokemon.id)) // Ensure only requested Pokémon are shown
    .forEach(displayPokemonCard);

  returnButton.style.display = "block"; // Show the 'Return to Pokédex' button
}

async function fetchByName(name) {
  const query = `
    query fetchByName($name: String!) {
      pokemon_v2_pokemon(where: { name: { _ilike: $name } }) {
        id
        }
        }
        `;
  try {
    const response = await fetchGraphQL(query, { name });
    return response.data.pokemon_v2_pokemon.map((pokemon) => pokemon.id);
  } catch (err) {
    console.error(`Error fetching name:`, err);
    return [];
  }
}

async function fetchByKeyword(keyword, value) {
  const queries = {
    type: `
        query fetchType($type: String!) {
          pokemon_v2_pokemontype(where: { pokemon_v2_type: { name: { _ilike: $type } } }) {
            pokemon_id
          }
        }
      `,
    ability: `
        query fetchAbility($ability: String!) {
          pokemon_v2_pokemonability(where: { pokemon_v2_ability: { name: { _ilike: $ability } } }) {
            pokemon_id
          }
        }
      `,
  };

  const query = queries[keyword];
  if (!query) return [];

  const variables = { [keyword]: value };
  try {
    const response = await fetchGraphQL(query, variables);
    const dataKey = Object.keys(response.data)[0];
    if (response.data[dataKey]) {
      return response.data[dataKey].map(
        (item) => item.pokemon_id || item.id
      );
    } else {
      console.error(`No data found for ${keyword}: ${value}`);
      return [];
    }
  } catch (err) {
    console.error(`Error fetching ${keyword}:`, err);
    return [];
  }
}