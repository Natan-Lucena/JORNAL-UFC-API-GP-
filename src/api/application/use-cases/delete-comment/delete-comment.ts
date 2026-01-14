import { failure, Result, success } from "@wave-telecom/framework/core";
import { CommentRepository } from "../../../domain/repository/CommentRepository";

export interface DeleteCommentOutput {
  message: string;
}

export class DeleteCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(
    commentId: string,
    userId: string
  ): Promise<Result<DeleteCommentOutput, Error>> {
    try {
      // Verificar se o comentário existe
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        return failure(new Error("Comment not found"));
      }

      // Verificar se o usuário é o dono do comentário
      if (comment.userId !== userId) {
        return failure(new Error("You can only delete your own comments"));
      }

      // Deletar comentário
      await this.commentRepository.delete(commentId);

      return success({
        message: "Comment deleted successfully",
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to delete comment")
      );
    }
  }
}
