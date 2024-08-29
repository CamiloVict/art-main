import dataArt from "../../art.json" assert { type: "json" };
import crypto from "crypto"; //* Added to generate UUIDs

export class ArtModel {
  static async getAll({ genre, medium }) {
    if (genre) {
      return dataArt.filter((art) =>
        art.genre.some((a) => a.toLowerCase() === genre.toLowerCase())
      );
    }
    if (medium) {
      return dataArt.filter(
        (art) => art.medium.toLowerCase() === medium.toLowerCase()
      );
    }
    return dataArt;
  }

  static async getById({ id }) {
    const art = dataArt.find((art) => art.id === id);
    return art;
  }

  static async create(input) {
    const newArt = {
      id: crypto.randomUUID(),
      ...input,
    };

    dataArt.push(newArt);
    return newArt;
  }

  static async delete({ id }) {
    const indexArt = dataArt.findIndex((movie) => movie.id === id);
    if (dataArtIndex === -1) return false
    dataArt.splice(dataArtIndex, 1);

    return indexArt;
  }

  static async update({ id, input }) {
    const indexArt = dataArt.findIndex((art) => art.id === id);
    if (indexArt === -1) {
      return res.status(400).json({ message: "Art not found" });
    }
    const updateArt = {
      ...dataArt[indexArt],
      ...input,
    };
    dataArt[indexArt] = updateArt;
    return dataArt[indexArt];
  }
}
