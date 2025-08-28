import express from "express";
import cors from "cors";
import morgan from "morgan";
import resourcesRouter from "./routes/resources";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "problem-4" });
});

app.use("/resources", resourcesRouter);

export default app;
