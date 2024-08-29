import { Router } from "express";
import { PaintController } from "../controllers/paints.js";

export const paintRouter = Router();

paintRouter.get("/", PaintController.getAll);

paintRouter.get("/:id", PaintController.getById);

paintRouter.post("/", PaintController.create);

paintRouter.delete("/:id", PaintController.delete);

paintRouter.patch("/:id", PaintController.update);
