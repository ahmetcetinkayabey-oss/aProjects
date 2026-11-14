import { Body, CanActivate, Controller, ExecutionContext, HttpCode, HttpException, HttpStatus, Injectable, Post, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { RateLimiter } from '../common/rate-limit.guard.js';
import { ChatService } from './chat.service.js';

/** IP başına saatte 20 mesaj. */
@Injectable()
class ChatRateLimitGuard implements CanActivate {
  private readonly limiter = new RateLimiter(20, 60 * 60 * 1000);
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (!this.limiter.take(req.ip ?? 'unknown')) {
      throw new HttpException('Çok fazla mesaj gönderdiniz. Lütfen biraz sonra tekrar deneyin.', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}

class ChatTurnDto {
  @IsIn(['user', 'assistant']) role!: 'user' | 'assistant';
  @IsString() @MaxLength(600) text!: string;
}

class ChatDto {
  @IsString() @MinLength(1) @MaxLength(500) message!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => ChatTurnDto)
  history?: ChatTurnDto[];
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(ChatRateLimitGuard)
  async send(@Body() dto: ChatDto) {
    return { reply: await this.chat.reply(dto.history ?? [], dto.message.trim()) };
  }
}
