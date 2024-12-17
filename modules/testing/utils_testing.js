import {print, capitalize, cleanInput, trimDash, numPad, parseRange, parseListIds}  from "../utilities.js";

let testName = capitalize("john"); 
print("capitalize: ", testName); // Output: "John"

let testNumber = numPad(12);
print("numPad: ",testNumber); // Output: "012"

let testInput = cleanInput("lorem ipsum dolor sit amet")
print("cleanInput: ",testInput)

testName = trimDash("Super Power");
print("trimDash: ", testName)

let myRange = parseRange("15:25");
print("parseRange: ", ... myRange);

let testList = parseListIds([1, 2, 4, 5, 6, 8, 9]);
print("parseListIds: ", ...testList); // Output: [[1, 2], 4, [5, 6], [8, 9]]
