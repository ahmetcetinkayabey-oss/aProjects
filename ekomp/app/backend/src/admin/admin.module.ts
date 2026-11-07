import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './admin-user.entity.js';
import { AdminAuthService } from './admin-auth.service.js';
import { AdminController } from './admin.controller.js';
import { AdminGuard } from './admin.guard.js';
import { FacilitiesModule } from '../facilities/facilities.module.js';
import { NewsModule } from '../news/news.module.js';
import { FeedbackModule } from '../feedback/feedback.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { ContentModule } from '../content/content.module.js';
import { ReservationsModule } from '../reservations/reservations.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser]), FacilitiesModule, NewsModule, ReservationsModule, FeedbackModule, ContentModule, NotificationsModule],
  controllers: [AdminController],
  providers: [AdminAuthService, AdminGuard],
})
export class AdminModule {}
