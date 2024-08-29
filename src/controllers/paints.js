import { ArtModel } from "../models/paint.js";
import {
  validateCreateArt,
  validatePartialArt,
} from "../../schemas/artSchemas/artSchemas.js";
export class PaintController {
  static async getAll(req, res) {
    const { medium, genre } = req.query;
    const art = await ArtModel.getAll({ genre, medium });
    return res.json(art);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const art = await ArtModel.getById({ id });
    if (art) return res.json(art);
    res.status(404).json({ message: "Art not Found" });
  }

  static async create(req, res) {
    const result = validateCreateArt(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newArt = await ArtModel.create(result.data);

    res.status(201).json(newArt);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const dataArtIndex = ArtModel.delete({ id });
    if (dataArtIndex === -1)
      return res.status(422).json({ message: "Movie not found" });

    // dataArt.splice(dataArtIndex, 1);

    return res.status(200).json({ message: "Paint deleted" });
  }

  static async update(req, res) {
    const { id } = req.params;
    const result = validatePartialArt(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    const updateArt = await ArtModel.update({ id, input: result.data });

    return res.status(200).json(updateArt);
  }
}
