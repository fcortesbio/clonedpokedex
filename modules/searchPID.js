
// Search functions
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const returnButton = document.createElement("button");
returnButton.className = "action-button";
returnButton.textContent = "Return to Pokédex";
returnButton.style.display = "none"; // Initially hidden
actionsContainer.appendChild(returnButton);

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
  currentOffset = 0;
  pokemonListContainer.innerHTML = "";
  loadPokedex(pokemonLoadConfig.initialLoadCount, currentOffset);
});

async function processSearchInput(query) {
  const sections = query.split(",").map((section) => section.trim());
  const allPIDs = new Set(); // prevents request duplication
  print(allPIDs);

  for (const section of sections) {
    const input = cleanInput(section);

    if (!isNaN(input)) {
      // Numeric input => Direct ID
      allPIDs.add(Number(input));
    } else if (input.includes(":")) {
      const [keyword, value] = input.split(":").map((s) => s.trim());
      if (keyword.match(/type|ability/i)) {
        const ids = await fetchByKeyword(keyword.toLowerCase(), value);
        ids.forEach((id) => allPIDs.add(id));
      } else if (!isNaN(keyword) && !isNaN(value)) {
        // Range input (e.g., 1:10)
        parseRange(input).forEach((id) => allPIDs.add(id));
      }
    } else {
      // Assume it's a Pokémon name
      const ids = await fetchByName(input);
      ids.forEach((id) => allPIDs.add(id));
    }
  }

  const outList = Array.from(allPIDs);
  console.log("Final Pokémon IDs:", outList);
  return outList;
}

async function fetchGraphQL(query, variables) {
  console.log("GraphQL Query:", query);
    console.log("GraphQL Variables:", variables);
  
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

