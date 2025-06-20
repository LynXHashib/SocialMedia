const fs = require('fs');
const path = require('path');
const logging = (err) => {
  fs.appendFileSync(
    path.join(__dirname, '..', 'log', 'logs.txt'),
    `${new Date().toISOString()} ${err.stack || err}\n\n`
  );
};

module.exports = { logging };
