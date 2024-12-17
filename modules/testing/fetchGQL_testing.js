function print(...content) {console.log(...content)} ; // lazy shortcut
import * as pkmFetch from "../fetchGQL.js";

let pokemon
pokemon = await pkmFetch.getData(1, 5)
print(pokemon)
pokemon = await pkmFetch.getData(6)
print(pokemon)

pokemon = await pkmFetch.getData(1)
print(pokemon)