import { fetchGraphQL } from "./fetchGQL.js";

export async function parseSearchInput(query) {
  // Helper functions
  const cleanInput = (input) => input.replace(/\s+/g, "");
  const parseRange = (range) => {
    const [start, end] = range.split(":").map(Number);
    if (start && end && start <= end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    return [];
  };

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

  // Parse the query
  const sections = query.split(",").map((section) => section.trim());
  const allPokemonIDs = new Set();

  for (const section of sections) {
    const input = cleanInput(section);

    if (!isNaN(input)) {
      // Numeric input => Direct ID
      allPokemonIDs.add(Number(input));
    } else if (input.includes(":")) {
      const [keyword, value] = input.split(":").map((s) => s.trim());
      if (keyword.match(/type|ability|region/i)) {
        const ids = await fetchByKeyword(keyword.toLowerCase(), value);
        ids.forEach((id) => allPokemonIDs.add(id));
      } else if (!isNaN(keyword) && !isNaN(value)) {
        // Range input (e.g., 1:10)
        parseRange(input).forEach((id) => allPokemonIDs.add(id));
      }
    } else {
      // Assume it's a Pokémon name
      const ids = await fetchByName(input);
      ids.forEach((id) => allPokemonIDs.add(id));
    }
  }

  const finalList = Array.from(allPokemonIDs);
  console.log("Final Pokémon IDs:", finalList);
  return finalList;
}
