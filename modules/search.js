// Search and filter Pokémon



async function processSearchInput(query) {
    // Clear the Pokédex list when a search is requested
    pokemonListContainer.innerHTML = "";
  
    // Split the query into individual parameters using "&"
    const inputs = query.split("&").map((input) => input.trim());
    console.log("Inputs:", inputs);
  
    let pokemonIds = [];
    let pokemonNames = [];
    let typeFilter = null;
    let rangeFilter = { start: null, end: null };
  
    // Parse inputs
    inputs.forEach((input) => {
      if (input.startsWith("type:")) {
        typeFilter = input.split(":")[1].trim();
      } 
      else if (input.startsWith("range:")) {
        const rangeMatch = input.match(/\[([0-9]+)-([0-9]+)\]/);
        if (rangeMatch) {
          rangeFilter.start = parseInt(rangeMatch[1], 10);
          rangeFilter.end = parseInt(rangeMatch[2], 10);
        } else {
          console.error("Invalid range format. Use range:[start-end]");
        }
      } 
      else if (!isNaN(input)) {
        pokemonIds.push(parseInt(input, 10));
      } 
      else {
        pokemonNames.push(input.toLowerCase());
      }
    });
  
    console.log("Parsed Filters:");
    console.log("Type Filter:", typeFilter);
    console.log("Range Filter:", rangeFilter);
    console.log("Pokemon IDs:", pokemonIds);
    console.log("Pokemon Names:", pokemonNames);
  
    // Fetch Pokémon by type if needed
    let typeResults = [];
    if (typeFilter) {
      typeResults = await fetchPokemonByType(typeFilter);
    }
  
    // Handle range filter
    let rangeResults = [];
    if (rangeFilter.start !== null && rangeFilter.end !== null) {
      const offset = rangeFilter.start - 1;
      const limit = rangeFilter.end - rangeFilter.start + 1;
      console.log("offset-limit:", offset,"-", limit)
      const rangeData = await fetchPokemonData(limit, offset);
      rangeResults = rangeData.map((pokemon) => pokemon.name);
    }
  
    // Combine all search terms
    const allPokemonNames = new Set([
      ...typeResults,
      ...rangeResults,
      ...pokemonNames,
      ...pokemonIds.map((id) => id.toString())
    ]);
  
    console.log("All Pokémon Names/IDs:", Array.from(allPokemonNames));
  
    // Fetch and display Pokémon details
    const pokemonDetailsPromises = Array.from(allPokemonNames).map((nameOrId) =>
      fetchPokemon(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
    );
  
    const pokemonData = await Promise.all(pokemonDetailsPromises);
    pokemonData.forEach(displayPokemon);
  
    // Update button visibility
    loadMoreButton.style.display = "none";
    returnButton.style.display = "block";
  }
  