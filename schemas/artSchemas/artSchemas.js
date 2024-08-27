import { z } from "zod";

const createArtSchema = z.object({
  title: z.string({
    invalid_type_error: "title must be a string",
    required_error: "title is a mandatory field",
  }),
  artist: z.string(),
  year: z
    .number({
      required_error: "Year is a mandatory field",
    })
    .int()
    .min(1500)
    .max(2024),
  medium: z.string().optional(),
  style: z.string().optional(),
  dimensions: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  genre: z.array(
    z.enum([
      "Renaissance",
      "Classical",
      "Romanticism",
      "Historical",
      "Early Netherlandish",
      "Triptych",
      "Baroque",
      "Group Portrait",
      "Regionalism",
      "Portrait",
      "Symbolism",
      "Romantic",
      "Mythological",
      "Renaissance",
      "Religious",
      "Cubism",
      "Political",
    ])
  ),
});

export function validateCreateArt(object) {
  return createArtSchema.safeParse(object);
}

export function validatePartialArt(object) {
  return createArtSchema.partial().safeParse(object);
}
