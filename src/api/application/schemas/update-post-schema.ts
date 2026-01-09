import { z } from "zod";
import { Category } from "../../domain/entities/enums/Category";

export const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  subtitle: z.string().min(1, "Subtitle is required").optional(),
  body: z.string().min(1, "Body is required").optional(),
  tag: z.string().min(1, "Tag is required").optional(),
  category: z
    .nativeEnum(Category, {
      errorMap: () => ({
        message: "Category must be graduação, extensão, pesquisa, or eventos",
      }),
    })
    .optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
