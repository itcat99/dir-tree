const fs = require("fs")
const path = require("path")

// const CHAR_CODES = ["─", "│", "└", "├"]
// const data = [{
//   title: 'a',
//   children: [{
//     title: "a_1"
//   }, {
//     title: "a_2"
//   }]
// }, {
//   title: 'b',
//   children: [{
//     title: "b_1"
//   }, {
//     title: "b_2",
//     children: [{
//       title: "b_2_1",
//       children: [{
//         title: "b_2_1-1",
//         children: [{
//           title: "b_2_1-1-1"
//         },{
//           title: "b_2_1-1-2"
//         }]
//       }, {
//         title: "b_2_1-2"
//       }]
//     }, {
//       title: "b_2_2"
//     }, {
//       title: "b_2_3"
//     }]
//   }]
// }];

/**
 * 扫描文件夹
 * 
 * @param {object} opts 配置选项
 * @param {string} opts.dir 目标文件夹
 * @param {number} opts.deep 扫描深度 当设置0时，为扫描全部深度
 * @param {number} opts.currentDeep 当前扫描深度
 * @param {object[]} opts.result 返回的目录结构
 * @param {array} opts.ignore 排除的目录
 * @param {array} opts.noChild 不扫描子目录的目录
 * 
 * @return {object[]}
 */
function scanDir(opts) {
  const { dir, deep = 0, ignore = [], noChild = [] } = opts;
  let { currentDeep = 0, result = [], } = opts;
  const absolutePath = path.isAbsolute(dir) ? path.resolve(process.cwd(), dir) : dir;

  const children = fs.readdirSync(absolutePath);
  for (const index in children) {
    const child = children[index];
    if (ignore.indexOf(child) >= 0) continue;
    const resultItem = {
      title: child
    }
    const currentPath = path.join(absolutePath, child);
    if (fs.statSync(currentPath).isDirectory() && noChild.indexOf(child) < 0) {
      resultItem.children = scanDir({ dir: currentPath, ignore, noChild, currentDeep: currentDeep + 1, result: [] })
    }

    result.push(resultItem)
  }

  return result;
}
/**
 * 
 * @param {array} data 目录数组
 * @param {string} tree 输出图形
 * @param {number} deep 深度
 */
function toTree(data, tree = "", deep = 0, last = false) {
  let pre = "├──";
  let parentLast = last;

  data.forEach((item, index) => {
    const { title, children } = item;
    if (index === data.length - 1) {
      pre = "└──";
      last = true;
    } else {
      last = false;
    }

    // console.log("deep: ", deep)
    const value = `${getSpace(deep, parentLast)}${pre} ${title}\n`
    tree += value;
    if (children) tree = toTree(children, tree, deep + 1, last);
  })

  return tree;
}

const getSpace = (deep, last) => {
  // console.log("last", last)
  let result = ""

  for(let i = 0; i < deep; i++){
    if(!last){
      result += "│   "
    }else{
      result += "    "
    }
  }

  return result;
}


const data = scanDir({ dir: "./", noChild: ['__test__'] });
// console.log("dir : ", JSON.stringify(data, null, 2))
console.log(toTree(data))
