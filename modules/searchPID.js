import { fetchByKeyword, fetchByName } from "./fetchGQL.js";
import { cleanInput, parseRange, print } from "./utilities.js";

// To be tested

async function parseSearchInput(query) {
  const sections = query.split(",").map((section) => section.trim());
  const allPIDs = new Set(); // prevents request duplication
  print(allPIDs)

  for (const section of sections) {
    const input = cleanInput(section);

    if (!isNaN(input)) {
      // Numeric input => Direct ID
      allPIDs.add(Number(input));
    } 
    else if (input.includes(":")) {
      const [keyword, value] = input.split(":").map((s) => s.trim());
      if (keyword.match(/type|ability|region/i)) {
        const ids = await fetchByKeyword(keyword.toLowerCase(), value);
        ids.forEach((id) => allPIDs.add(id));
      } 
      else if (!isNaN(keyword) && !isNaN(value)) {
        // Range input (e.g., 1:10)
        parseRange(input).forEach((id) => allPIDs.add(id));
      }
    } 
    else {
      // Assume it's a Pokémon name
      const ids = await fetchByName(input);
      ids.forEach((id) => allPIDs.add(id));
    }
  }

  const outList = Array.from(allPIDs);
  console.log("Final Pokémon IDs:", outList);
  return outList;
}
