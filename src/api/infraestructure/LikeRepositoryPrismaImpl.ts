import { PrismaClient } from "@prisma/client";
import { Like } from "../domain/entities/Like";
import { LikeRepository } from "../domain/repository/LikeRepository";
import { getPrismaClient } from "../../shared/infra/database/prisma-client";

export class LikeRepositoryPrismaImpl implements LikeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async save(like: Like): Promise<void> {
    await this.prisma.like.upsert({
      where: {
        postId_userId: {
          postId: like.postId,
          userId: like.userId,
        },
      },
      create: {
        id: like.id,
        postId: like.postId,
        userId: like.userId,
      },
      update: {},
    });
  }

  async findByPostAndUser(
    postId: string,
    userId: string
  ): Promise<Like | undefined> {
    const likeData = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!likeData) {
      return undefined;
    }

    return Like.create({
      id: likeData.id,
      postId: likeData.postId,
      userId: likeData.userId,
    });
  }

  async findByPost(postId: string): Promise<Like[]> {
    const likesData = await this.prisma.like.findMany({
      where: { postId },
    });

    return likesData.map((likeData) =>
      Like.create({
        id: likeData.id,
        postId: likeData.postId,
        userId: likeData.userId,
      })
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.like.delete({
      where: { id },
    });
  }

  async countByPost(postId: string): Promise<number> {
    return this.prisma.like.count({
      where: { postId },
    });
  }
}
