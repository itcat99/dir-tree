const { dirTree, scanDir } = require("./index.js");

console.log("scanDir: ", scanDir({ dir: "./" }));
console.log("dirTree: ", dirTree({ dir: "./" }));
