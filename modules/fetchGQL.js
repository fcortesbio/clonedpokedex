async function fetchGraphQL(query, variables) {
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
      ? `Fetching data for Pokemon ID=${endId}`
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
      }
    }
  `;

  try {
    const response = await fetchGraphQL(query, { startId, endId });
    console.log("GraphQL Response:", response);

    const { data } = response;

    if (data && data.pokemon_v2_pokemon) {
      for (const pokemon of data.pokemon_v2_pokemon) {
        const filteredData = {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((typeData) => typeData.type.name),
        };
        pokemonData.push(filteredData);
      }
    } else {
      console.error("No data returned for the specified query.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
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
  // Helper functions
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
    region: `
      query fetchRegion($region: String!) {
        pokemon_v2_pokemonspecies(where: { pokemon_v2_generation: { name: { _ilike: $region } } }) {
          id
        }
      }
    `,
  };

  const query = queries[keyword];
  if (!query) return [];

  const variables = { [keyword]: value };
  try {
    const response = await fetchGraphQL(query, variables);
    return response.data[Object.keys(response.data)[0]].map(
      (item) => item.pokemon_id || item.id
    );
  } catch (err) {
    console.error(`Error fetching ${keyword}:`, err);
    return [];
  }
}