const path = require('path');

if (!process.env.STAGE) {
  console.error(`STAGE cannot be undefined.`);
  process.exit(1);
}

const env = require('dotenv').config({
  path : path.join(__dirname, `../../.env.${process.env.STAGE}`),
}).parsed;

if (!env) {
  console.error(`Environment cannot be undefined.`);
}

module.exports = () => {
  return JSON.stringify(env);
};
