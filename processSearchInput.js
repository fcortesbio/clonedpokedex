export async function processSearchInput(query) {
    console.clear();
    if (!query) {
      alert("Please enter a valid search query.");
      return;
    }
  
    const sections = query.split(",").map((section) => section.trim());
    const allPIDs = new Set();
  
    for (const section of sections) {
      const input = removeWhiteSpace(section).toLowerCase();
  
      try {
        if (!isNaN(input)) {
          // Direct ID search
          allPIDs.add(Number(input));
        } else if (input.includes(":")) {
          const [keyword, value] = input.split(":").map((s) => s.trim());
          if (keyword === "type" || keyword === "ability") {
            const ids = await fetchByKeyword(keyword, value);
            ids.forEach((id) => allPIDs.add(id));
          } else {
            alert(`Invalid keyword: ${keyword}`);
          }
        } else if (input.includes("-")) {
          // Range search (e.g., 1-3)
          const [start, end] = input.split("-").map(Number);
          if (start && end && start <= end) {
            for (let i = start; i <= end; i++) {
              allPIDs.add(i);
            }
          } else {
            alert(`Invalid range: ${input}`);
          }
        } else {
          // Name search
          const ids = await fetchByName(input);
          ids.forEach((id) => allPIDs.add(id));
        }
      } catch (error) {
        console.error("Error processing search section:", error);
        alert(`Error processing search section: ${section}`);
      }
    }
  
    const finalIDs = Array.from(allPIDs).sort((a, b) => a - b);
    if (finalIDs.length === 0) {
      alert("No Pokémon matched your search query.");
      return;
    }
  
    displaySearchResults(finalIDs);
  }