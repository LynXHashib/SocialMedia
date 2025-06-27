const dotenv = require('dotenv').config();
const { app, http } = require('./index');

const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server Running at ${PORT}\n`);
// });
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
