function print(...content) {console.log(...content)} ; // lazy shortcut
import * as utils from "../utilities.js";

const userName = utils.toCaps("john"); 
const paddedNumber = utils.numPadding(12);
const groupedIds = utils.parseListIds([1, 2, 4, 5, 6, 8, 9]);

print(userName); // Output: "John"
print(paddedNumber); // Output: "012"
print(groupedIds); // Output: [[1, 2], 4, [5, 6], [8, 9]]