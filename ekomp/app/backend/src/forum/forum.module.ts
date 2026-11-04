import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumAdminController } from './forum-admin.controller.js';
import { ForumAuthService } from './forum-auth.service.js';
import { ForumController } from './forum.controller.js';
import {
  ForumAnnouncement,
  ForumMedia,
  ForumParticipant,
  ForumSession,
  ForumSpeaker,
  ForumSponsor,
  ForumToken,
} from './forum.entities.js';
import { ParticipantGuard } from './forum-participant.guard.js';
import { ForumService } from './forum.service.js';
import { AdminGuard } from '../admin/admin.guard.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([
      ForumParticipant,
      ForumToken,
      ForumSession,
      ForumSpeaker,
      ForumMedia,
      ForumAnnouncement,
      ForumSponsor,
    ]),
  ],
  controllers: [ForumController, ForumAdminController],
  providers: [ForumService, ForumAuthService, ParticipantGuard, AdminGuard],
})
export class ForumModule {}
