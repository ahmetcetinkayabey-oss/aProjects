import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteContent } from './site-content.entity.js';
import { ContentService } from './content.service.js';
import { ContentController } from './content.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([SiteContent])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
