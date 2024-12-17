export async function getData(startId, endId, batchSize = 20) {
  if (startId > endId) {
    throw new Error(`Invalid input: startId (${startId}) cannot be greater than endId (${endId}).`);
  }

  const pokemonData = [];
  let offset = startId - 1;
  endId = endId || startId;

  console.log(
    `[INFO] ${startId === endId ? `Fetching data for Pokemon ID=${startId}` : `Fetching data from ID=${startId} to ID=${endId}`}`
  );

  while (offset < endId) {
    const limit = Math.min(batchSize, endId - offset);
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    try {
      const data = await fetchWithRetry(url);

      const detailRequests = data.results.map(async (pokemon) => {
        try {
          const pokemonDetails = await fetchWithRetry(pokemon.url);
          return {
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            types: pokemonDetails.types.map((typeData) => typeData.type.name),
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

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`Retry ${i + 1}/${retries} for ${url}`);
    }
  }
  throw new Error(`Failed to fetch after ${retries} attempts: ${url}`);
}
