import { failure, Result, success } from "@wave-telecom/framework/core";
import { Comment } from "../../../domain/entities/Comment";
import { CommentRepository } from "../../../domain/repository/CommentRepository";
import { PostRepository } from "../../../domain/repository/PostRepository";
import { CreateCommentInput } from "../../schemas/create-comment-schema";

export interface CreateCommentOutput {
  comment: {
    id: string;
    text: string;
    userId: string;
    postId: string;
  };
}

export class CreateCommentUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private postRepository: PostRepository
  ) {}

  async execute(
    input: CreateCommentInput,
    userId: string
  ): Promise<Result<CreateCommentOutput, Error>> {
    try {
      // Verificar se o post existe
      const post = await this.postRepository.findById(input.postId);
      if (!post) {
        return failure(new Error("Post not found"));
      }

      // Criar comentário
      const comment = Comment.create({
        text: String(input.text),
        userId: userId,
        postId: input.postId,
      });

      // Salvar comentário
      await this.commentRepository.save(comment);

      return success({
        comment: comment.toJSON(),
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to create comment")
      );
    }
  }
}
