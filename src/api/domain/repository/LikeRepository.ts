import { Like } from "../entities/Like";

export interface LikeRepository {
  save: (like: Like) => Promise<void>;
  findByPostAndUser: (postId: string, userId: string) => Promise<Like | undefined>;
  findByPost: (postId: string) => Promise<Like[]>;
  delete: (id: string) => Promise<void>;
  countByPost: (postId: string) => Promise<number>;
}
