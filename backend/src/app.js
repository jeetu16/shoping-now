import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js'

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());


app.use('/api', routes);

app.use("*", (_req,res) => {
    res.status(404).json({
        success: false,
        message: "Not found anything with this route"
    });
})

export default app;