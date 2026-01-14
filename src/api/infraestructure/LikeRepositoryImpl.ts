import { Like } from "../domain/entities/Like";
import { LikeRepository } from "../domain/repository/LikeRepository";

export class LikeRepositoryImpl implements LikeRepository {
  private likes: Like[] = [];

  async save(like: Like): Promise<void> {
    const existingIndex = this.likes.findIndex((l) => l.id === like.id);
    if (existingIndex >= 0) {
      this.likes[existingIndex] = like;
    } else {
      this.likes.push(like);
    }
  }

  async findByPostAndUser(
    postId: string,
    userId: string
  ): Promise<Like | undefined> {
    return this.likes.find(
      (l) => l.postId === postId && l.userId === userId
    );
  }

  async findByPost(postId: string): Promise<Like[]> {
    return this.likes.filter((l) => l.postId === postId);
  }

  async delete(id: string): Promise<void> {
    const index = this.likes.findIndex((l) => l.id === id);
    if (index >= 0) {
      this.likes.splice(index, 1);
    }
  }

  async countByPost(postId: string): Promise<number> {
    return this.likes.filter((l) => l.postId === postId).length;
  }
}
