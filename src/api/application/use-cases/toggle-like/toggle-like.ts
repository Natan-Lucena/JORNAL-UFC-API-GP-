import { failure, Result, success } from "@wave-telecom/framework/core";
import { Like } from "../../../domain/entities/Like";
import { LikeRepository } from "../../../domain/repository/LikeRepository";
import { PostRepository } from "../../../domain/repository/PostRepository";

export interface ToggleLikeOutput {
  liked: boolean;
  message: string;
}

export class ToggleLikeUseCase {
  constructor(
    private likeRepository: LikeRepository,
    private postRepository: PostRepository
  ) {}

  async execute(
    postId: string,
    userId: string
  ): Promise<Result<ToggleLikeOutput, Error>> {
    try {
      // Verificar se o post existe
      const post = await this.postRepository.findById(postId);
      if (!post) {
        return failure(new Error("Post not found"));
      }

      // Verificar se o usuário já deu like
      const existingLike = await this.likeRepository.findByPostAndUser(
        postId,
        userId
      );

      if (existingLike) {
        // Remover like
        await this.likeRepository.delete(existingLike.id);
        return success({
          liked: false,
          message: "Like removed successfully",
        });
      } else {
        // Adicionar like
        const like = Like.create({
          postId: postId,
          userId: userId,
        });
        await this.likeRepository.save(like);
        return success({
          liked: true,
          message: "Like added successfully",
        });
      }
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to toggle like")
      );
    }
  }
}
