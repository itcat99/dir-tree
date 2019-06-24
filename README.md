# dir-tree

Get a tree view of the directory structure.

![screenshot](https://github.com/itcat99/dir-tree/blob/master/assets/screenshot.png)

## Install

```bash
yarn add global @fremango/dir-tree

#or
npm i -g @fremango/dir-tree
```

## Usage

### Cli

```bash
dir-tree <dir> [options]
```

### Nodejs

```js
const { dirTree, scanDir } = require("dir-tree");

const dir = scanDir({
  dir: "./"
});
console.log("dir for Object", JSON.stringfly(dir, null, 2));
const tree = dirTree({
  dir: "./"
});

console.log("Tree: ", tree);
```

## Apis

### scanDir

> Scan the directory with the configured options, return directory struct object

scanDir(Options, callback)

return `dirStruct`

#### dirStruct

| name     | type        | default | desc                                                                  |
| -------- | ----------- | ------- | --------------------------------------------------------------------- |
| name     | string      | ''      | directory name                                                        |
| isDir    | boolean     | false   | is directory                                                          |
| path     | string      | ''      | directory absolute path                                               |
| children | dirStruct[] | []      | if isDir is `true`, `children` is this directory's children directory |

#### callback

> custom the structure of each item

(itemStruct) => itemStruct

| name       | type      | desc                      |
| ---------- | --------- | ------------------------- |
| itemStruct | dirStruct | directory's struct object |

### dirTree

> return a tree view of the directory structure.

dirTree(options)

## Options

### deep

desc: Scan the depth of the directory, if it is 0, scan all directories and their subdirectories

type: number

default: 0

use in cli: `-d <number>` or `--deep <number>`

### ignore

desc: Ignored directory

type: string[]

default: undefined

use in cli: `-i "<dir>,<dir>,..."` or `--ignore "<dir>,<dir>,..."`

### noChild

desc: Don't scan subdirectories of this directory

type: string[]

default: undefined

use in cli: `-n "<dir>,<dir>,..."` or `--noChild "<dir>,<dir>,..."`

### color

desc: Output color text

type: Boolean

default: true

use in cli: `--no-color` disabled color text