import express from "express";
import { paintRouter } from "./src/routes/paints.js";
import { corsMiddleware } from "./src/middleware/cors.js";
const PORT = process.env.PORT ?? 8080;

const app = express();

app.disable("x-powered-by");

//* Middleware to parse JSON bodies
app.use(express.json());

app.use(corsMiddleware());

//* Endpoint to get art data
app.use("/paints", paintRouter);

//* 404 handler
app.use((req, res) => {
  res.status(404).send("<h1>Page Not Found</h1>");
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

export default app;
