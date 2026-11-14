import { Module } from '@nestjs/common';
import { FacilitiesModule } from '../facilities/facilities.module.js';
import { AiService } from './ai.service.js';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';

@Module({
  imports: [FacilitiesModule],
  controllers: [ChatController],
  providers: [AiService, ChatService],
  exports: [AiService],
})
export class AiModule {}
