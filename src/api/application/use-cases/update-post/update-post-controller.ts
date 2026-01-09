import { Request, Response } from "express";
import { UpdatePostUseCase } from "./update-post";
import { updatePostSchema } from "../../schemas/update-post-schema";

export class UpdatePostController {
  constructor(private updatePostUseCase: UpdatePostUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Verificar se userId está presente
      if (!req.userId) {
        return res.status(401).json({
          error: "User ID not found in request",
        });
      }

      const postId = req.params.id;
      if (!postId) {
        return res.status(400).json({
          error: "Post ID is required",
        });
      }

      // Validar entrada (campos opcionais)
      const validationResult = updatePostSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validationResult.error.errors,
        });
      }

      // Verificar se pelo menos um campo foi fornecido para atualizar
      if (
        !validationResult.data.title &&
        !validationResult.data.subtitle &&
        !validationResult.data.body &&
        !validationResult.data.tag &&
        !validationResult.data.category &&
        !req.file
      ) {
        return res.status(400).json({
          error: "At least one field must be provided for update",
        });
      }

      // Executar use case
      const result = await this.updatePostUseCase.execute(
        postId,
        req.userId,
        validationResult.data,
        req.file
      );

      if (!result.ok) {
        const statusCode =
          result.error.message === "Post not found" ? 404 : 400;
        return res.status(statusCode).json({
          error: result.error.message,
        });
      }

      return res.status(200).json(result.value);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
