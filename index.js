import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

// DATABASE connection
mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => { console.log('MondoDB is connected') }
  )
  .catch(
    error => { console.log(error) }
  );
// DATABASE connection


const app = express();


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});