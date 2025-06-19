const dotenv = require('dotenv').config();
const app = require('./index');

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Running at port 5000\n`);
});
