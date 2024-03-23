import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route.js';

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

app.use('/api/user', userRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});