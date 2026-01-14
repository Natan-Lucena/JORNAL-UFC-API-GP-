import { failure, Result, success } from "@wave-telecom/framework/core";
import { PostRepository } from "../../../domain/repository/PostRepository";
import { LikeRepository } from "../../../domain/repository/LikeRepository";
import { CommentRepository } from "../../../domain/repository/CommentRepository";
import { UserRepository } from "../../../domain/repository/UserRepository";

export interface GetPostByIdOutput {
  post: {
    id: string;
    title: string;
    subtitle: string;
    body: string;
    tag: string;
    media: string;
    category: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
    };
    createdAt: Date;
  };
  likesCount: number;
  comments: Array<{
    id: string;
    text: string;
    userId: string;
    postId: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
    };
  }>;
}

export class GetPostByIdUseCase {
  constructor(
    private postRepository: PostRepository,
    private likeRepository: LikeRepository,
    private commentRepository: CommentRepository,
    private userRepository: UserRepository
  ) {}

  async execute(postId: string): Promise<Result<GetPostByIdOutput, Error>> {
    try {
      // Buscar post
      const post = await this.postRepository.findById(postId);
      if (!post) {
        return failure(new Error("Post not found"));
      }

      // Contar likes
      const likesCount = await this.likeRepository.countByPost(postId);

      // Buscar comentários
      const comments = await this.commentRepository.findByPost(postId);

      // Buscar dados dos usuários dos comentários
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          const user = await this.userRepository.findById(comment.userId);
          if (!user) {
            throw new Error(`User not found for comment ${comment.id}`);
          }
          return {
            id: comment.id,
            text: comment.text,
            userId: comment.userId,
            postId: comment.postId,
            user: user.toJSON(),
          };
        })
      );

      return success({
        post: post.toJSON(),
        likesCount,
        comments: commentsWithUsers,
      });
    } catch (error) {
      return failure(
        error instanceof Error
          ? error
          : new Error("Failed to get post by id")
      );
    }
  }
}
