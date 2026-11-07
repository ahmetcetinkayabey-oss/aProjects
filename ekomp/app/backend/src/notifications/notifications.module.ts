import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSetting } from './app-setting.entity.js';
import { NotificationsService } from './notifications.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AppSetting])],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
