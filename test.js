const { dirTree, scanDir } = require("./index.js");

const dirStruct = scanDir({ dir: "./", ignore:['node_modules', ".git"], }, item => {
  const {path: itemPath} = item;
  const tempParentArr = itemPath.split("/")
  tempParentArr.pop()

  const parentPath = tempParentArr.join("/")
  const parentTitle = tempParentArr[tempParentArr.length - 1]

  item = Object.assign({}, item, {
    parent: {
      title:parentTitle,
      path: parentPath
    }
  })
  
  return item
})
console.log(" dirStruct: ", dirStruct)
console.log("dirTree: ", dirTree({ dir: "./" }));
