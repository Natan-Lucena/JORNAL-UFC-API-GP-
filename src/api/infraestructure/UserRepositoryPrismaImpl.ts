import { PrismaClient, Role as PrismaRole } from "@prisma/client";
import { User } from "../domain/entities/User";
import { Role } from "../domain/entities/enums/Role";
import { UserRepository } from "../domain/repository/UserRepository";
import { getPrismaClient } from "../../shared/infra/database/prisma-client";

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

function mapDomainRoleToPrisma(role: Role): PrismaRole {
  switch (role) {
    case Role.STUDENT:
      return PrismaRole.STUDENT;
    case Role.ADMIN:
      return PrismaRole.ADMIN;
    case Role.TEACHER:
      return PrismaRole.TEACHER;
    default:
      return PrismaRole.STUDENT;
  }
}

export class UserRepositoryPrismaImpl implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: mapDomainRoleToPrisma(user.role),
        createdAt: user.createdAt,
      },
      update: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: mapDomainRoleToPrisma(user.role),
      },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!userData) {
      return undefined;
    }

    return User.create({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: mapPrismaRoleToDomain(userData.role),
      createdAt: userData.createdAt,
    });
  }

  async findById(id: string): Promise<User | undefined> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return undefined;
    }

    return User.create({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: mapPrismaRoleToDomain(userData.role),
      createdAt: userData.createdAt,
    });
  }
}
