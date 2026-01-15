import {
  PrismaClient,
  Category as PrismaCategory,
  Role as PrismaRole,
} from "@prisma/client";
import { Post } from "../domain/entities/Post";
import { User } from "../domain/entities/User";
import { Category } from "../domain/entities/enums/Category";
import { Role } from "../domain/entities/enums/Role";
import { PostRepository } from "../domain/repository/PostRepository";
import { getPrismaClient } from "../../shared/infra/database/prisma-client";

function mapPrismaCategoryToDomain(category: PrismaCategory): Category {
  switch (category) {
    case PrismaCategory.GRADUACAO:
      return Category.GRADUACAO;
    case PrismaCategory.EXTENSAO:
      return Category.EXTENSAO;
    case PrismaCategory.PESQUISA:
      return Category.PESQUISA;
    case PrismaCategory.EVENTOS:
      return Category.EVENTOS;
    default:
      return Category.GRADUACAO;
  }
}

function mapDomainCategoryToPrisma(category: Category): PrismaCategory {
  switch (category) {
    case Category.GRADUACAO:
      return PrismaCategory.GRADUACAO;
    case Category.EXTENSAO:
      return PrismaCategory.EXTENSAO;
    case Category.PESQUISA:
      return PrismaCategory.PESQUISA;
    case Category.EVENTOS:
      return PrismaCategory.EVENTOS;
    default:
      return PrismaCategory.GRADUACAO;
  }
}

function mapPrismaRoleToDomain(role: PrismaRole): Role {
  switch (role) {
    case PrismaRole.STUDENT:
      return Role.STUDENT;
    case PrismaRole.ADMIN:
      return Role.ADMIN;
    case PrismaRole.TEACHER:
      return Role.TEACHER;
    default:
      return Role.STUDENT;
  }
}

export class PostRepositoryPrismaImpl implements PostRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async save(post: Post): Promise<void> {
    await this.prisma.post.upsert({
      where: { id: post.id },
      create: {
        id: post.id,
        title: post.title,
        subtitle: post.subtitle,
        body: post.body,
        tag: post.tag,
        media: post.media,
        category: mapDomainCategoryToPrisma(post.category),
        userId: post.user.id,
        createdAt: post.createdAt,
      },
      update: {
        title: post.title,
        subtitle: post.subtitle,
        body: post.body,
        tag: post.tag,
        media: post.media,
        category: mapDomainCategoryToPrisma(post.category),
        userId: post.user.id,
      },
    });
  }

  async findAll(): Promise<Post[]> {
    const postsData = await this.prisma.post.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return postsData.map((postData) => this.mapToDomain(postData));
  }

  async findById(id: string): Promise<Post | undefined> {
    const postData = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!postData) {
      return undefined;
    }

    return this.mapToDomain(postData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }

  private mapToDomain(postData: {
    id: string;
    title: string;
    subtitle: string;
    body: string;
    tag: string;
    media: string;
    category: PrismaCategory;
    userId: string;
    createdAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
      password: string;
      role: PrismaRole;
      createdAt: Date;
    };
  }): Post {
    const user = User.create({
      id: postData.user.id,
      name: postData.user.name,
      email: postData.user.email,
      password: postData.user.password,
      role: mapPrismaRoleToDomain(postData.user.role),
      createdAt: postData.user.createdAt,
    });

    return Post.create({
      id: postData.id,
      title: postData.title,
      subtitle: postData.subtitle,
      body: postData.body,
      tag: postData.tag,
      media: postData.media,
      category: mapPrismaCategoryToDomain(postData.category),
      user,
      createdAt: postData.createdAt,
    });
  }
}
