export function print(...content) {console.log(...content)} ;
export function capitalize(word) {return word.charAt(0).toUpperCase() + word.slice(1);}
export function cleanInput(input) {return input.replace(/\s+/g, "")};
export function trimDash(name) {return name.trim().toLowerCase().replace(" ", "-");}
export function numPad(n) {return n > 999?n.toString():n.toString().padStart(3, "0");}

export function parseRange(range) {
  // to be adjusted
  const [start, end] = range.split(":").map(Number);
  if (start && end && start <= end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  return [];
}; 

export function parseListIds(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return [];

  const sortedNumbers = [...new Set(numbers)].sort((a, b) => a - b);
  const result = [];
  let tempGroup = [sortedNumbers[0]];

  for (let i = 1; i < sortedNumbers.length; i++) {
    const current = sortedNumbers[i];
    const previous = sortedNumbers[i - 1];

    if (current === previous + 1) {
      tempGroup.push(current);
    } else {
      result.push(tempGroup.length === 1 ? tempGroup[0] : [...tempGroup]);
      tempGroup = [current];
    }
  }
  result.push(tempGroup.length === 1 ? tempGroup[0] : [...tempGroup]); 

return result;
}
