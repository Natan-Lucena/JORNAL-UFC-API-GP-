import { PrismaClient } from "@prisma/client";
import { Comment } from "../domain/entities/Comment";
import { CommentRepository } from "../domain/repository/CommentRepository";
import { getPrismaClient } from "../../shared/infra/database/prisma-client";

export class CommentRepositoryPrismaImpl implements CommentRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async save(comment: Comment): Promise<void> {
    await this.prisma.comment.upsert({
      where: { id: comment.id },
      create: {
        id: comment.id,
        text: comment.text,
        userId: comment.userId,
        postId: comment.postId,
      },
      update: {
        text: comment.text,
        userId: comment.userId,
        postId: comment.postId,
      },
    });
  }

  async findByPost(postId: string): Promise<Comment[]> {
    const commentsData = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: {
        createdAt: "asc",
      },
    });

    return commentsData.map((commentData) =>
      Comment.create({
        id: commentData.id,
        text: commentData.text,
        userId: commentData.userId,
        postId: commentData.postId,
      })
    );
  }

  async findById(id: string): Promise<Comment | undefined> {
    const commentData = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!commentData) {
      return undefined;
    }

    return Comment.create({
      id: commentData.id,
      text: commentData.text,
      userId: commentData.userId,
      postId: commentData.postId,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }
}
