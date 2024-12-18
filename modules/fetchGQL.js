async function fetchGraphQL(query, variables) {
  console.log("GraphQL Query:", query);
  console.log("GraphQL Variables:", variables);

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

  return await result.json();
}

export async function fetchPokemonAttributes(startId, endId, batchSize = 20) {
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
              pokemon.species?.flavor_text?.[0]?.flavor_text || "No description available.",
            sprite: pokemon.sprites?.sprites || null,
          };
          pokemonData.push(filteredData);
        }
      } else {
        console.error(`No data returned for batch ID=${batchStart} to ID=${batchEnd}`);
      }
    }
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }

  return pokemonData;
}



export async function fetchByName(name) {
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

export async function fetchByKeyword(keyword, value) {
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