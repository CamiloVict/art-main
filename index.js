import express from "express";
import path from "path";
import fs from "fs/promises";
import cors from "cors";
import crypto from "crypto"; // Added to generate UUIDs
// *Schemas
import {
  validateCreateArt,
  validatePartialArt,
} from "./schemas/artSchemas/artSchemas.js";

const PORT = process.env.PORT ?? 8080;

const app = express();

app.disable("x-powered-by");

//* Middleware to parse JSON bodies
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = ["http://localhost:8080"];

      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Read JSON file asynchronously
const jsonFilePath = path.resolve("./art.json");

const getDataArt = async () => {
  //* Read and parse the JSON file
  const data = await fs.readFile(jsonFilePath, "utf-8");
  return JSON.parse(data);
};

//* Endpoint to get art data
app.get("/paints", async (req, res) => {
  const dataArt = await getDataArt();
  const { medium, genre } = req.query;

  if (genre) {
    const filteredArts = dataArt.filter((art) =>
      art.genre.some((a) => a.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredArts);
  }

  if (medium) {
    const filteredArts = dataArt.filter(
      (data) => data.medium.toLowerCase() === medium.toLowerCase()
    );
    return res.json(filteredArts);
  }

  return res.json(dataArt);
});

app.get("/paints/:id", async (req, res) => {
  const dataArt = await getDataArt();
  const { id } = req.params;

  const art = dataArt.find((art) => art.id === id);

  if (art) return res.json(art);

  res.status(404).json({ message: "Art not Found" });
});

//* Endpoint to update existing art data
app.patch("/paints/:id", async (req, res) => {
  const dataArt = await getDataArt();
  const { id } = req.params;
  const result = validatePartialArt(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const artIndex = dataArt.findIndex((art) => art.id === id);

  if (artIndex === -1) {
    return res.status(400).json({ message: "Art not found" });
  }

  const updateArt = {
    ...dataArt[artIndex],
    ...result.data,
  };

  dataArt[artIndex] = updateArt;

  res.status(200).json(updateArt);
});

//* Endpoint to create new art data
app.post("/paints", async (req, res) => {
  const dataArt = await getDataArt();
  const result = validateCreateArt(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newArt = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  dataArt.push(newArt);

  res.status(201).json(newArt);
});

// // *Cors Origin
// app.options("/art/:id", (req, res) => {
//   const origin = req.headers(origin);

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header(
//       "Access-Control-Allow-Origin",
//       "GET",
//       "POST",
//       "PATCH",
//       "DELETE"
//     );
//   }

//   res.send(200)
// });

//* Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

//* 404 handler
app.use((req, res) => {
  res.status(404).send("<h1>Page Not Found</h1>");
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
