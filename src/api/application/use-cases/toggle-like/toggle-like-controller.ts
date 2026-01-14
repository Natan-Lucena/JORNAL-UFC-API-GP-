import { Request, Response } from "express";
import { ToggleLikeUseCase } from "./toggle-like";

export class ToggleLikeController {
  constructor(private toggleLikeUseCase: ToggleLikeUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "User ID not found in request",
        });
      }

      const postId = req.params.postId;
      if (!postId) {
        return res.status(400).json({
          error: "Post ID is required",
        });
      }

      const result = await this.toggleLikeUseCase.execute(postId, req.userId);

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
