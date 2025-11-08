import { http } from './index';
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server Running at ${PORT}\n`);
// });
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
