import { Request, Response } from "express";
import { CreateCommentUseCase } from "./create-comment";
import { createCommentSchema } from "../../schemas/create-comment-schema";

export class CreateCommentController {
  constructor(private createCommentUseCase: CreateCommentUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: "User ID not found in request",
        });
      }

      const validationResult = createCommentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validationResult.error.errors,
        });
      }

      const result = await this.createCommentUseCase.execute(
        validationResult.data,
        req.userId
      );

      if (!result.ok) {
        return res.status(400).json({
          error: result.error.message,
        });
      }

      return res.status(201).json(result.value);
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
