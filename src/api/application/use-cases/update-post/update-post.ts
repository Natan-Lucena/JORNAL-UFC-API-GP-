import { failure, Result, success } from "@wave-telecom/framework/core";
import { Post } from "../../../domain/entities/Post";
import { PostRepository } from "../../../domain/repository/PostRepository";
import { UserRepository } from "../../../domain/repository/UserRepository";
import { UpdatePostInput } from "../../schemas/update-post-schema";
import { FileStorage } from "../../service/file-storage";
import { Category } from "../../../domain/entities/enums/Category";

export interface UpdatePostOutput {
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
}

export class UpdatePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private fileStorage: FileStorage
  ) {}

  async execute(
    postId: string,
    userId: string,
    input: UpdatePostInput,
    file?: Express.Multer.File
  ): Promise<Result<UpdatePostOutput, Error>> {
    try {
      // Verificar se o post existe
      const existingPost = await this.postRepository.findById(postId);
      if (!existingPost) {
        return failure(new Error("Post not found"));
      }

      // Verificar se o usuário é o dono do post
      if (existingPost.user.id !== userId) {
        return failure(new Error("You can only update your own posts"));
      }

      // Verificar se o usuário ainda existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return failure(new Error("User not found"));
      }

      // Upload do novo arquivo se fornecido
      let mediaUrl = existingPost.media;
      if (file) {
        const uploadResult = await this.fileStorage.saveFile({
          taskId: userId,
          file: file,
        });
        mediaUrl = uploadResult.url;
      }

      // Criar post atualizado
      const updatedPost = Post.create({
        id: existingPost.id,
        title: input.title ? String(input.title) : existingPost.title,
        subtitle: input.subtitle ? String(input.subtitle) : existingPost.subtitle,
        body: input.body ? String(input.body) : existingPost.body,
        tag: input.tag ? String(input.tag) : existingPost.tag,
        media: mediaUrl,
        category: input.category
          ? (input.category as Category)
          : existingPost.category,
        user: user,
        createdAt: existingPost.createdAt,
      });

      // Salvar post atualizado
      await this.postRepository.save(updatedPost);

      return success({
        post: updatedPost.toJSON(),
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to update post")
      );
    }
  }
}
