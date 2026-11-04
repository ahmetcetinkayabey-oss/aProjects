import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilitiesModule } from './facilities/facilities.module.js';
import { AdminModule } from './admin/admin.module.js';
import { NewsModule } from './news/news.module.js';
import { ForumModule } from './forum/forum.module.js';
import { FeedbackModule } from './feedback/feedback.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.get<string>('NODE_ENV') === 'production') {
          return {
            type: 'postgres',
            url: config.getOrThrow<string>('DATABASE_URL'),
            ssl: { rejectUnauthorized: false }, // Supabase TLS ister
            autoLoadEntities: true,
            // Boş veritabanında ilk deploy için DB_SYNCHRONIZE=true; tablolar oluşunca kaldırın.
            synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
            extra: { max: 5 },
          };
        }
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DB_SQLITE_PATH', 'data/dev.sqlite'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    FacilitiesModule,
    ReservationsModule,
    NewsModule,
    ForumModule,
    FeedbackModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
