async function fetchGraphQL(query, variables) {
  const result = await fetch(
    "https://beta.pokeapi.co/graphql/v1beta",
    {
      method: "POST",
      
      headers: 
      {
        "Content-Type": "application/json"
      },
      
      body: JSON.stringify({
        variables: variables,
        query: query,
      }),
    }
  );

return await result.json();
}

export async function getData(startId, endId, batchSize = 20) {
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
