export function print(...content) {
  console.log(...content);
}

export function removeScapeCharacters(input) {
  return input
    .replace(/[\n\f\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function removeWhiteSpace(input) {
  return input.replace(/\s+/g, "");
} 

export function kebabCase(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-");
}

export function leadingZeros(n, length = 3) {
  return n.toString().padStart(length, "0");
}

export function parseRange(range) {
  try {
    let [start, end] = range.split(":").map(Number);
    if (start && end && start <= end) {
      return [start, end];
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
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