import { Request, Response } from "express";
import { GetPostByIdUseCase } from "./get-post-by-id";

export class GetPostByIdController {
  constructor(private getPostByIdUseCase: GetPostByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const postId = req.params.id;
      if (!postId) {
        return res.status(400).json({
          error: "Post ID is required",
        });
      }

      const result = await this.getPostByIdUseCase.execute(postId);

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
