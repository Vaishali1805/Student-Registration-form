import express from 'express'
import cors from 'cors'
//import cookieParser from 'cookie-parser';
import configDotenv from 'dotenv';
configDotenv.config();
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
const PORT = process.env.PORT;
const app = express();

//Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));     //limit to remove the error -payload too large
app.use('/uploads', express.static('uploads'));
app.use('/user', userRoute);
app.use('/auth', authRoute);

app.listen(PORT, (req, res) => {
    console.log("server is running on PORT: ", PORT);
})