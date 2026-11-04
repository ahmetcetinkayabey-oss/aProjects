import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PublicFormRateLimitGuard } from '../common/rate-limit.guard.js';
import { FeedbackService } from './feedback.service.js';
import { CreateFeedbackDto } from './feedback.dto.js';

/** Herkese açık: yalnızca geri bildirim gönderme. Listeleme ve yönetim /api/admin altındadır. */
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  @Post()
  @UseGuards(PublicFormRateLimitGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedback.create(dto);
  }
}
