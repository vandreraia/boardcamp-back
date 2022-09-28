import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import gamesRouter from "./routes/gamesRouter.js";
import customersRouter from "./routes/customersRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import rentalsRouter from "./routes/rentalsRouter.js"

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.use(customersRouter);
server.use(gamesRouter);
server.use(categoriesRouter);
server.use(rentalsRouter);

server.listen(process.env.PORT, () => {
  console.info(chalk.bold.green("Servidor aberto na porta.: ", process.env.PORT));
}); 