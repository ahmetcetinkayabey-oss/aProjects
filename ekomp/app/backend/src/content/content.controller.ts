import { Controller, Get } from '@nestjs/common';
import { ContentService } from './content.service.js';

/** Herkese açık: sitede gösterilen, yönetici tarafından değiştirilmiş metinler. */
@Controller('content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get()
  list() {
    return this.content.asMap();
  }
}
