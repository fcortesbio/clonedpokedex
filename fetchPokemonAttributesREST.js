export async function fetchPokemonAttributesREST(startId, endId, batchSize = 20) {
    if (startId > endId) {
      throw new Error(
        `Invalid input: startId (${startId}) cannot be greater than endId (${endId}).`
      );
    }
  
    const pokemonData = [];
    let offset = startId - 1;
    endId = endId || startId;
  
    console.log(
      `[INFO] ${startId === endId
        ? `Fetching data for Pokemon ID=${startId}`
        : `Fetching data from ID=${startId} to ID=${endId}`
      }`
    );
  
    while (offset < endId) {
      const limit = Math.min(batchSize, endId - offset);
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  
      try {
        const data = await fetchWithRetry(url);
  
        const detailRequests = data.results.map(async (pokemon) => {
          try {
            const pokemonDetails = await fetchWithRetry(pokemon.url);
            const speciesDetails = await fetchWithRetry(pokemonDetails.species.url); // Fetch species details
            return {
              id: pokemonDetails.id,
              name: pokemonDetails.name,
              types: pokemonDetails.types.map((typeData) => typeData.type.name),
              stats: pokemonDetails.stats.map((statData) => ({
                name: statData.stat.name,
                value: statData.base_stat,
              })),
              abilities: pokemonDetails.abilities.map(
                (abilityData) => abilityData.ability.name
              ),
              description: speciesDetails.flavor_text_entries.find(
                (entry) => entry.language.name === 'en' // Find English description
              )?.flavor_text || "No description available.",
              sprite: pokemonDetails.sprites.front_default || null,
            };
          } catch (error) {
            console.error(`Error fetching details for ${pokemon.name}:`, error);
            return null;
          }
        });
  
        const fetchedDetails = await Promise.all(detailRequests);
        pokemonData.push(...fetchedDetails.filter(Boolean));
      } catch (error) {
        console.error(`Error fetching batch at offset ${offset}:`, error);
      }
  
      offset += limit;
    }
  
    return pokemonData;
  }