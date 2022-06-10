import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import "express-async-errors";
import helmet from "helmet";
import responseTime from "response-time";
import { StatusCodes } from "http-status-codes";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT ?? 8085;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(responseTime());

const SEND_INTERVAL = 2000;

const donation = {
  user: 0,
  amount: 0,
};

const writeEvent = (res: Response, sseId: string, data: string) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
};

const sendEvent = (_req: Request, res: Response) => {
  res.writeHead(StatusCodes.OK, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });

  const sseId = new Date().toDateString();

  setInterval(() => {
    writeEvent(res, sseId, JSON.stringify(donation));
  }, SEND_INTERVAL);

  writeEvent(res, sseId, JSON.stringify(donation));
};

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "server side events nodejs 🙂" });
});

app.get("/dashboard", (req: Request, res: Response) => {
  if (req.headers.accept === "text/event-stream") {
    sendEvent(req, res);
  } else {
    res.json({ message: "Ok" });
  }
});

app.post("/donate", (req, res) => {
  const amount = req.body.amount || 0;

  if (amount > 0) {
    donation.amount += amount;
    donation.user += 1;
  }

  return res.json({ message: "Thank you 🙏" });
});

app.all("*", async (req: Request, res: Response) => {
  res.send({ error: `☠️ url no existe` }).status(StatusCodes.NOT_FOUND);
});

app.listen(port, () => {
  console.log(`servidor nodejs server side events 👂 en puerto ${port}`);
});
