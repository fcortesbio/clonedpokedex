import {print, capitalize, removeWhiteSpace, kebabCase, leadingZeros, parseRange, parseListIds}  from "../utilities.js";

let testName = capitalize("john"); 
print("capitalize: ", testName); // Output: "John"

let testNumber = leadingZeros(12);
print("leadingZeros: ",testNumber); // Output: "012"

let testInput = removeWhiteSpace("lorem ipsum dolor sit amet")
print("removeWhiteSpace: ",testInput)

testName = kebabCase("Super Power");
print("kebabCase: ", testName)

let myRange = parseRange("15:25");
print("parseRange: ", ... myRange);

let testList = parseListIds([1, 2, 4, 5, 6, 8, 9]);
print("parseListIds: ", ...testList); // Output: [[1, 2], 4, [5, 6], [8, 9]]
