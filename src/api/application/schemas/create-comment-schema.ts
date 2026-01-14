import { z } from "zod";

export const createCommentSchema = z.object({
  text: z.string().min(1, "Text is required"),
  postId: z.string().uuid("Post ID must be a valid UUID"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
