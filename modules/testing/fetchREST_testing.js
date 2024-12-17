import { getData } from "../fetchREST.js"; // Assuming your function is in 'your-module.js'

// Helper function to compare arrays regardless of order
function compareArraysIgnoringOrder(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return arr1.every(item => set2.has(item)) && arr2.every(item => set1.has(item));
}

async function testGetData() {
  try {
    // Test case 1: Fetching a range of Pokemon
    let startTime = performance.now();
    let pokemon = await getData(1, 5);
    let endTime = performance.now();
    let expectedData = [
      { id: 1, name: "bulbasaur", types: ["grass", "poison"] },
      { id: 2, name: "ivysaur", types: ["grass", "poison"] },
      { id: 3, name: "venusaur", types: ["grass", "poison"] },
      { id: 4, name: "charmander", types: ["fire"] },
      { id: 5, name: "charmeleon", types: ["fire"] }
    ];
    if (JSON.stringify(pokemon) === JSON.stringify(expectedData)) {
      console.log(`Test case 1 passed (Response time: ${endTime - startTime} ms)`);
    } else {
      console.error("Test case 1 failed", pokemon, expectedData);
    }

    // Test case 2: Fetching a single Pokemon
    startTime = performance.now();
    pokemon = await getData(6);
    endTime = performance.now();
    expectedData = [{ id: 6, name: "charizard", types: ["fire", "flying"] }];
    if (JSON.stringify(pokemon) === JSON.stringify(expectedData)) {
      console.log(`Test case 2 passed (Response time: ${endTime - startTime} ms)`);
    } else {
      console.error("Test case 2 failed", pokemon, expectedData);
    }

    // Test case 3: Handling invalid input (e.g., startId greater than endId)
    try {
      startTime = performance.now();
      pokemon = await getData(5, 1);
      endTime = performance.now();
      console.error("Test case 3 failed: Expected an error but got data", pokemon);
    } catch (error) {
      console.log(`Test case 3 passed: Error handled correctly (Response time: ${endTime - startTime} ms)`, error);
    }

    // Test case 4: Handling very large ranges
    startTime = performance.now();
    pokemon = await getData(1, 100);
    endTime = performance.now();
    if (pokemon.length === 100) {
      console.log(`Test case 4 passed (Response time: ${endTime - startTime} ms)`);
    } else {
      console.error("Test case 4 failed: Incorrect number of Pokemon fetched", pokemon.length);
    }

    // Test case 5: Fetching with a different batch size
    startTime = performance.now();
    pokemon = await getData(1, 50, 5);
    endTime = performance.now();
    if (pokemon.length === 50) {
      console.log(`Test case 5 passed (Response time: ${endTime - startTime} ms)`);
    } else {
      console.error("Test case 5 failed: Incorrect number of Pokemon fetched", pokemon.length);
    }

    // Test case 6: Handling non-existent Pokemon IDs
    try {
      startTime = performance.now();
      pokemon = await getData(10000, 10005); // Assuming these IDs don't exist
      endTime = performance.now();
      console.error("Test case 6 failed: Expected an error but got data", pokemon);
    } catch (error) {
      console.log(`Test case 6 passed: Error handled correctly (Response time: ${endTime - startTime} ms)`, error);
    }

    // Test case 7: Fetching with only startId provided
    startTime = performance.now();
    pokemon = await getData(151);
    endTime = performance.now();
    expectedData = [{ id: 151, name: "mew", types: ["psychic"] }];
    if (JSON.stringify(pokemon) === JSON.stringify(expectedData)) {
      console.log(`Test case 7 passed (Response time: ${endTime - startTime} ms)`);
    } else {
      console.error("Test case 7 failed", pokemon, expectedData);
    }

  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

testGetData();