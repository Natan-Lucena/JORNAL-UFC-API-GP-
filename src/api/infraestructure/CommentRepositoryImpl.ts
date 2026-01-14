import { Comment } from "../domain/entities/Comment";
import { CommentRepository } from "../domain/repository/CommentRepository";

export class CommentRepositoryImpl implements CommentRepository {
  private comments: Comment[] = [];

  async save(comment: Comment): Promise<void> {
    const existingIndex = this.comments.findIndex((c) => c.id === comment.id);
    if (existingIndex >= 0) {
      this.comments[existingIndex] = comment;
    } else {
      this.comments.push(comment);
    }
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.comments.filter((c) => c.postId === postId);
  }

  async findById(id: string): Promise<Comment | undefined> {
    return this.comments.find((c) => c.id === id);
  }

  async delete(id: string): Promise<void> {
    const index = this.comments.findIndex((c) => c.id === id);
    if (index >= 0) {
      this.comments.splice(index, 1);
    }
  }
}
