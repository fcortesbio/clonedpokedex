import { performance } from "perf_hooks"; // For high precision time measurement
import { getData as fetchREST } from "../fetchREST.js";
import { getData as fetchGQL } from "../fetchGQL.js";

async function benchmarkTest(iterations, batchSizes) {
  const results = {};

  // Loop over different batch sizes
  for (const size of batchSizes) {
    console.log(`\n--- Running tests for batch size: ${size} ---`);

    const restTimes = [];
    const gqlTimes = [];

    for (let i = 0; i < iterations; i++) {
      console.log(`Iteration ${i + 1} for batch size ${size}`);

      // REST: Measure start and end times
      let startTime = performance.now();
      await fetchREST(1, size);
      let endTime = performance.now();
      const restTime = endTime - startTime;
      restTimes.push(restTime);

      // GraphQL: Measure start and end times
      startTime = performance.now();
      await fetchGQL(1, size);
      endTime = performance.now();
      const gqlTime = endTime - startTime;
      gqlTimes.push(gqlTime);
    }

    // Calculate averages
    const avgRestTime = restTimes.reduce((a, b) => a + b, 0) / iterations;
    const avgGQLTime = gqlTimes.reduce((a, b) => a + b, 0) / iterations;

    // Store results
    results[size] = {
      REST: avgRestTime.toFixed(3),
      GQL: avgGQLTime.toFixed(3),
    };

    console.log(
      `\nBatch Size ${size} Averages:\nREST: ${avgRestTime.toFixed(3)} ms\nGQL: ${avgGQLTime.toFixed(3)} ms`
    );
  }

  return results;
}

// Define test parameters
const iterations = 10; // Number of runs per batch size
const batchSizes = [1, 10, 100, 1000]; // Batch sizes to test

// Run the benchmark and print the results
(async () => {
  const finalResults = await benchmarkTest(iterations, batchSizes);
  console.log("\n=== Final Results ===");
  console.table(finalResults);
})();


////////////////////////////////////////////////// 
//    Batch Size 1000 Averages:
//    REST: 8483.054 ms
//    GQL: 313.504 ms
// 
//    === Final Results ===
//    ┌─────────┬────────────┬──────────┐
//    │ (index) │ REST       │ GQL       │
//    ├─────────┼────────────┼──────────┤
//    │ 1       │ '181.089'  │ '118.633' │
//    │ 10      │ '185.803'  │ '94.917'  │
//    │ 100     │ '879.873'  │ '94.672'  │
//    │ 1000    │ '8483.054' │ '313.504' │
//    └─────────┴────────────┴──────────┘
////////////////////////////////////////////////