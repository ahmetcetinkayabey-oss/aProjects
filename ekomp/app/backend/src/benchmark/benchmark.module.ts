import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenchmarkCenter } from './benchmark-center.entity.js';
import { DigitalScore } from './digital-score.entity.js';
import { BenchmarkService } from './benchmark.service.js';
import { BenchmarkController } from './benchmark.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([BenchmarkCenter, DigitalScore])],
  controllers: [BenchmarkController],
  providers: [BenchmarkService],
})
export class BenchmarkModule {}
