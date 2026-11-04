import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity.js';
import { NEWS_SEED } from './news.seed.js';
import { CreateNewsDto, UpdateNewsDto } from './news.dto.js';

@Injectable()
export class NewsService implements OnModuleInit {
  constructor(
    @InjectRepository(News) private readonly repo: Repository<News>,
  ) {}

  async onModuleInit(): Promise<void> {
    // Yeni eklenen örnek haberler mevcut kurulumlara da gelsin diye eksik slug'lar eklenir.
    // Bir haberi kaldırmak için silmek yerine "yayında değil" yapın; silinen örnek haber yeniden eklenir.
    const existing = new Set(
      (await this.repo.find({ select: { slug: true } })).map((n) => n.slug),
    );
    const missing = NEWS_SEED.filter((n) => !existing.has(n.slug));
    if (missing.length) await this.repo.save(missing);
  }

  findPublished(): Promise<News[]> {
    return this.repo.find({
      where: { published: true },
      order: { publishedAt: 'DESC' },
    });
  }

  findAll(): Promise<News[]> {
    return this.repo.find({ order: { publishedAt: 'DESC' } });
  }

  create(dto: CreateNewsDto): Promise<News> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateNewsDto): Promise<News> {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Haber bulunamadı.');
    return this.repo.save(Object.assign(item, dto));
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Haber bulunamadı.');
  }

  count(): Promise<number> {
    return this.repo.count();
  }
}
