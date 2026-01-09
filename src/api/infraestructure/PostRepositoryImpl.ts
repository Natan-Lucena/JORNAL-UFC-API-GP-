import { Post } from "../domain/entities/Post";
import { PostRepository } from "../domain/repository/PostRepository";

export class PostRepositoryImpl implements PostRepository {
  private posts: Post[] = [];

  async save(post: Post): Promise<void> {
    const existingIndex = this.posts.findIndex((p) => p.id === post.id);
    if (existingIndex >= 0) {
      this.posts[existingIndex] = post;
    } else {
      this.posts.push(post);
    }
  }

  async findAll(): Promise<Post[]> {
    return [...this.posts];
  }

  async findById(id: string): Promise<Post | undefined> {
    return this.posts.find((p) => p.id === id);
  }

  async delete(id: string): Promise<void> {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index >= 0) {
      this.posts.splice(index, 1);
    }
  }
}
