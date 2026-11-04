import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity.js';
import { CreateFeedbackDto } from './feedback.dto.js';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private readonly repo: Repository<Feedback>,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<{ ok: true }> {
    await this.repo.save(this.repo.create(dto));
    return { ok: true };
  }

  findAll(): Promise<Feedback[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async setHandled(id: string, handled: boolean): Promise<Feedback> {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Geri bildirim bulunamadı.');
    item.handled = handled;
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected)
      throw new NotFoundException('Geri bildirim bulunamadı.');
  }
}
