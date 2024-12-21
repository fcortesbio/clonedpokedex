const queries = {
  name: `
    query fetchByName($name: String!) {
      pokemon_v2_pokemon(where: { name: { _ilike: $name } }) {
        id
      }
    }
  `,
  type: `
    query fetchType($type: String!) {
      pokemon_v2_type(where: { name: { _ilike: $type } }) {
        pokemon_v2_pokemontypes {
          pokemon_id
        }
      }
    }
  `,
  ability: `
    query fetchAbility($ability: String!) {
      pokemon_v2_ability(where: { name: { _ilike: $ability } }) {
        pokemon_v2_pokemonabilities {
          pokemon_id
        }
      }
    }
  `,
};

export async function fetchPokemonByQuery(query) {
    try {
      const input = removeWhiteSpace(query).toLowerCase();
  
      if (!isNaN(input)) {
        // Direct ID search
        return [Number(input)]; 
      } else if (input.includes(":")) {
        const [keyword, value] = input.split(":").map((s) => s.trim());
        return await fetchByKeyword(keyword, value); 
      } else {
        // Name search
        return await fetchByName(input); 
      }
    } catch (err) {
      console.error("Error fetching Pokémon IDs:", err);
      return [];
    }
  }