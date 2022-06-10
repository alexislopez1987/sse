import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import "express-async-errors";
import helmet from "helmet";
import responseTime from "response-time";
import { StatusCodes } from "http-status-codes";

const app: Express = express();
const port = process.env.PORT ?? 8085;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(responseTime());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "server side events nodejs 🙂" });
});

app.all("*", async (req: Request, res: Response) => {
  res.send({ error: `☠️ url no existe` }).status(StatusCodes.NOT_FOUND);
});

app.listen(port, () => {
  console.log(`servidor nodejs server side events 👂 en puerto ${port}`);
});
