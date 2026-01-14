import { Comment } from "../entities/Comment";

export interface CommentRepository {
  save: (comment: Comment) => Promise<void>;
  findByPost: (postId: string) => Promise<Comment[]>;
  findById: (id: string) => Promise<Comment | undefined>;
  delete: (id: string) => Promise<void>;
}
