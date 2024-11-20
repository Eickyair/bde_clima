import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import v1Router from './routers/v1.js';
import morgan from 'morgan';
dotenv.config();
const app = express();
const port = 3000;
app.use(cors({
    origin: `*`,
}))
app.use(express.json());
app.use(morgan('common'));
app.use('/api/v1', v1Router);
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});