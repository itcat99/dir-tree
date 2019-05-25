const fs = require("fs");
const path = require("path");

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
 * @param {string} opts.dir 目录地址
 * @param {number} opts.deep 扫描深度 当设置0时，为扫描所有子目录 默认为0
 * @param {number} opts.currentDeep 当前扫描深度
 * @param {object[]} opts.result 返回的目录结构
 * @param {array} opts.ignore 排除的目录
 * @param {array} opts.noChild 排除子目录的目录
 *
 * @return {object[]}
 */
function scanDir(opts) {
  const { dir, deep = 0, ignore = [], noChild = [] } = opts;
  let { currentDeep = 0, result = [] } = opts;
  const absolutePath = path.isAbsolute(dir)
    ? path.resolve(process.cwd(), dir)
    : dir;

  const children = fs.readdirSync(absolutePath);
  for (const index in children) {
    const child = children[index];
    if (ignore.indexOf(child) >= 0) continue;
    const resultItem = {
      title: child
    };
    const currentPath = path.join(absolutePath, child);
    if (fs.statSync(currentPath).isDirectory() && noChild.indexOf(child) < 0) {
      if (deep !== 0 && currentDeep >= deep - 1) continue;

      resultItem.children = scanDir({
        dir: currentPath,
        ignore,
        noChild,
        currentDeep: currentDeep + 1,
        result: [],
        deep
      });
    }

    result.push(resultItem);
  }

  return result;
}
/**
 *
 * @param {array} data 目录数组
 * @param {string} tree 输出图形
 * @param {number} deep 深度
 */
function toTree(data, tree = "", deep = 0, last = false, lastList = []) {
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

    lastList[deep] = last;

    const value = `${getSpace(deep, lastList)}${pre} ${title}\n`;
    tree += value;
    if (children) {
      tree = toTree(children, tree, deep + 1, last, lastList);
    }
  });

  return tree;
}

const getSpace = (deep, lastList) => {
  let result = "";

  for (let i = 0; i < deep; i++) {
    const isLast = lastList[i];

    if (!isLast) {
      result += "│   ";
    } else {
      result += "    ";
    }
  }

  return result;
};

module.exports = {
  /**
   * 返回目录结构树
   *
   * @param {object} opts 配置项
   * @param {string} opts.dir 目录路径
   * @param {number} opts.deep 扫描深度 当为0时，扫描所有子目录 默认为0
   * @param {string[]} opts.ignore 排除的目录
   * @param {string[]} opts.noChild 排除子目录的目录
   */
  dirTree: ({ dir, deep, noChild, ignore }) => {
    const data = scanDir({ dir, deep, noChild, ignore });
    return `\n${toTree(data)}`;
  },
  /**
   * 以object形式返回目录结构
   *
   * @param {object} opts 配置项
   * @param {string} opts.dir 目录路径
   * @param {number} opts.deep 扫描深度 当为0时，扫描所有子目录 默认为0
   * @param {string[]} opts.ignore 排除的目录
   * @param {string[]} opts.noChild 排除子目录的目录
   */
  scanDir: ({ dir, deep, noChild, ignore }) =>
    scanDir({ dir, deep, noChild, ignore })
};
