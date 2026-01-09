import { failure, Result, success } from "@wave-telecom/framework/core";
import { PostRepository } from "../../../domain/repository/PostRepository";

export interface DeletePostOutput {
  message: string;
}

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(
    postId: string,
    userId: string
  ): Promise<Result<DeletePostOutput, Error>> {
    try {
      // Verificar se o post existe
      const post = await this.postRepository.findById(postId);
      if (!post) {
        return failure(new Error("Post not found"));
      }

      // Verificar se o usuário é o dono do post
      if (post.user.id !== userId) {
        return failure(new Error("You can only delete your own posts"));
      }

      // Deletar post
      await this.postRepository.delete(postId);

      return success({
        message: "Post deleted successfully",
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to delete post")
      );
    }
  }
}
