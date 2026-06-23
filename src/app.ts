import express, { Express } from "express";
import cookieParser from "cookie-parser";
import Routes from "./routes";
import { errorHandler, errorNotFoundHandler } from "./middleware/error-handler";

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const routes = new Routes();
app.use('/api', routes.router);

app.use(errorNotFoundHandler);
app.use(errorHandler);