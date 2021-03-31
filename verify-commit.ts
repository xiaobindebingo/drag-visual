const msgPath = process.env.HUSKY_GIT_PARAMS;
const fs = require('fs');
const msg = fs.readFileSync(msgPath);
const reg = /^(fix|feat|docs|chore|style|perf|test|refactor|workflow)(\(.+\))?: .{1,50}/g

if (!reg.test(msg)) {
  console.error(`不合法的commit提交方式${msg}。`)
}