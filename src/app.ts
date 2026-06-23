import express, { Express } from "express";
import Routes from "./routes";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const routes = new Routes();
app.use('/api', routes.router);