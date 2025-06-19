const fs = require('fs');
const path = require('path');
const logging = (err) => {
  fs.appendFileSync(
    path.join(__dirname, '..', 'log', 'logs.txt'),
    `${new Date().toISOString()} ${err.stack || err}\n\n`
  );
  return res.status(500).json({
    message: 'error',
  });
};

module.exports = { logging };
