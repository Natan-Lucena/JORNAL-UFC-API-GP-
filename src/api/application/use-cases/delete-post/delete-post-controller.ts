import { Request, Response } from "express";
import { DeletePostUseCase } from "./delete-post";

export class DeletePostController {
  constructor(private deletePostUseCase: DeletePostUseCase) {}

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

      // Executar use case
      const result = await this.deletePostUseCase.execute(
        postId,
        req.userId
      );

      if (!result.ok) {
        return res.status(400).json({
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
