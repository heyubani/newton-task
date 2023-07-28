import express, {urlencoded, json} from "express";
import cors from 'cors';
import "dotenv/config";
require("./models/database").default;
import apiRoute from './routes/';



const app = express();
const Port = process.env.PORT ||  8080;
import "dotenv/config";

 
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/api/v1', apiRoute);

app.use('*', (req, res) => {
  res.status(404);
  res.json({
    status: 'Failed',
    message: 'Page not found'
  });
});


app.listen(Port, () => console.log(`Application running on port ${Port}`))