import { processSearchInput } from "../searchPID.js"; 

const result = await processSearchInput("25");
console.log(result); // Expected: [25]



// (async () => {
//   const result = await processSearchInput("1:5");
//   console.log(result); // Expected: [1, 2, 3, 4, 5]
// })();

// (async () => {
//   const result = await processSearchInput("type:fire");
//   console.log(result); // Expected: List of Pokémon IDs with the Fire type (based on your data)
// })();

// (async () => {
//   const result = await processSearchInput("ability:overgrow");
//   console.log(result); // Expected: List of Pokémon IDs with the Overgrow ability
// })();

// (async () => {
//   const result = await processSearchInput("pikachu");
//   console.log(result); // Expected: Pokémon ID(s) for Pikachu
// })();

// (async () => {
//   const result = await processSearchInput(":fire");
//   console.log(result); // Expected: Empty array or error handling message

//   const result2 = await processSearchInput("type:");
//   console.log(result2); // Expected: Empty array or error handling message
// })();

// (async () => {
//   const result = await processSearchInput("pikachu, pikachu, 25");
//   console.log(result); // Expected: [25] (no duplicates)
// })();
