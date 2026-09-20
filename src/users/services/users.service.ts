import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

/** Repository-pattern service for admin user management. */
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  async updateRole(id: string, role: Role) {
    await this.ensureExists(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        imageUrl: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.user.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('User not found');
  }
}
