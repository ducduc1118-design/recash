import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClicksService {
  constructor(private prisma: PrismaService) {}

  async createLink(userId: string, rawUrl: string) {
    const url = rawUrl?.trim();
    if (!url) {
      throw new BadRequestException('url is required');
    }

    const stores = await this.prisma.store.findMany();
    const lower = url.toLowerCase();
    const matched = stores.find((store) => lower.includes(store.name.toLowerCase()));
    if (!matched) {
      throw new BadRequestException('Unsupported store');
    }

    await this.prisma.click.create({
      data: {
        userId,
        url,
      },
    });

    return {
      store: matched,
      cashback: matched.cashbackUpTo,
    };
  }
}
