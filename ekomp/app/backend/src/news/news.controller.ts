import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service.js';
import { News } from './news.entity.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findPublished(): Promise<News[]> {
    return this.newsService.findPublished();
  }
}
