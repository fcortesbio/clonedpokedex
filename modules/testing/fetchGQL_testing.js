function print(...content) {console.log(...content)} ; // lazy shortcut
import * as pkmFetch from "../fetchGQL.js";

let pokemon
pokemon = await pkmFetch.fetchPokemonAttributes(1)
print(pokemon)

// pokemon = await pkmFetch.fetchPokemonAttributes(6)
// print(pokemon)

// pokemon = await pkmFetch.fetchPokemonAttributes(1)
// print(pokemon)

// pokemon = await pkmFetch.fetchPokemonAttributes(20)
// print(pokemon)

// // pokemon = await pkmFetch.fetchPokemonAttributes(50)
// // print(pokemon)

// // pokemon = await pkmFetch.fetchPokemonAttributes(100)
// // print(pokemon)

// let grassTypes = await pkmFetch.fetchByKeyword("type", "grass");
// print("Grass type Pokémon IDs: ", ...grassTypes)

// let lightningRod = await pkmFetch.fetchByKeyword("ability", "lightning-rod");
// print(`Pokemon with ability Lightning Rod: `, ...lightningRod)

// let guts = await pkmFetch.fetchByKeyword("ability", "guts");
// print(`Pokemon with ability  Guts:`, ...guts)

