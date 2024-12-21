import { fetchGraphQL } from "./fetchGraphQL.js";

export async function fetchPokemonAttributes(ids) {
    const pokemonData = [];
  
    console.log(`Fetching data for Pokémon IDs: ${ids.join(", ")}`);
  
    const query = `
      query pokemon_details($ids: [Int!]!) {
        pokemon_v2_pokemon(where: { id: { _in: $ids } }) {
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
      const response = await fetchGraphQL(query, { ids });
      console.log(response);
  
      const { data } = response;
      if (data && data.pokemon_v2_pokemon) {
        // Process the fetched data and populate pokemonData array
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
              pokemon.species?.flavor_text?.[0]?.flavor_text ||
              "No description available.",
            sprite: pokemon.sprites?.[0]?.sprites || null,
          };
          pokemonData.push(filteredData);
        }
      } else {
        console.error(`No data returned for IDs: ${ids.join(", ")}`);
      }
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  
    return pokemonData;
  }