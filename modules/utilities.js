export function print(...content) {console.log(...content)} ;

export function toCaps(word) {
  // returns a Capitalized string
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function numPadding(number) {
  // Introduce the padding zeros for numbers lower than 999
  return number > 999 ? number.toString() : number.toString().padStart(3, "0");
}

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
