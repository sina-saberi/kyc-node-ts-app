import express from 'express';
import cors from 'cors';
import customerController from './controllers/customers';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use('/customers', customerController);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
