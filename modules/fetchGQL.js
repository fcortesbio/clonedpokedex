async function fetchGraphQL(query, variables) {
    const result = await fetch(
      "https://beta.pokeapi.co/graphql/v1beta",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      }
    );
  
    return await result.json();
  }
  
  export async function getData(startId, endId, batchSize = 20) {
    const pokemonData = [];
    endId = endId || startId; // If endId is not defined, set it to startId
  
    // Log the fetch operation
    if (endId === startId) {
      console.log(`Fetching data for Pokemon ID=${endId}`);
    } else {
      console.log(`Fetching data for Pokémon from ID=${startId} to ID=${endId}`);
    }
  
    // Construct the GraphQL query
    const query = `
      query pokemon_details($startId: Int!, $endId: Int!) {
        pokemon_v2_pokemon(where: {id: {_between: [$startId, $endId]}}) {
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
      // Fetch the data using the GraphQL query
      const { data } = await fetchGraphQL(query, { startId, endId });
  
      // Extract the relevant data
      for (const pokemon of data.pokemon_v2_pokemon) {
        const filteredData = {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((typeData) => typeData.type.name),
        };
        pokemonData.push(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
    return pokemonData;
  }


  