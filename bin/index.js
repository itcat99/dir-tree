#!/usr/bin/env node
const program = require("commander");
const { dirTree } = require("../");
const pkg = require("../package.json");

program.version(pkg.version);

program
  .arguments("<dir>")
  .option("-i | --ignore <ignore>", "ignore dir")
  .option("-n | --noChild <noChild>", "ignore dir child")
  .option("-d | --deep <deep>", "scan deep")
  .option("--no-color", "don't show color")
  .action((dir, cmd) => {
    const { ignore, noChild, deep = 0, color } = cmd;
    const opts = {
      dir,
      deep: deep * 1,
      noChild: noChild && noChild.split(","),
      ignore: ignore && ignore.split(","),
      color
    };

    console.log(dirTree(opts));
  });

program.parse(process.argv);
