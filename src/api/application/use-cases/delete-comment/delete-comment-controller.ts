import { Request, Response } from "express";
import { DeleteCommentUseCase } from "./delete-comment";

export class DeleteCommentController {
  constructor(private deleteCommentUseCase: DeleteCommentUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "User ID not found in request",
        });
      }

      const commentId = req.params.id;
      if (!commentId) {
        return res.status(400).json({
          error: "Comment ID is required",
        });
      }

      const result = await this.deleteCommentUseCase.execute(
        commentId,
        req.userId
      );

      if (!result.ok) {
        const statusCode =
          result.error.message === "Comment not found" ? 404 : 400;
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
