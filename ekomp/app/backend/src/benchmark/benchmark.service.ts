import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BenchmarkCenter } from './benchmark-center.entity.js';
import { DigitalScore } from './digital-score.entity.js';
import { BENCHMARK_CENTERS_SEED, DIGITAL_SCORES_SEED } from './benchmark.seed.js';

@Injectable()
export class BenchmarkService implements OnModuleInit {
  constructor(
    @InjectRepository(BenchmarkCenter)
    private readonly benchmarkCentersRepository: Repository<BenchmarkCenter>,
    @InjectRepository(DigitalScore)
    private readonly digitalScoresRepository: Repository<DigitalScore>,
  ) {}

  async onModuleInit(): Promise<void> {
    const [centersCount, scoresCount] = await Promise.all([
      this.benchmarkCentersRepository.count(),
      this.digitalScoresRepository.count(),
    ]);

    if (centersCount === 0) {
      await this.benchmarkCentersRepository.save(BENCHMARK_CENTERS_SEED);
    }
    if (scoresCount === 0) {
      await this.digitalScoresRepository.save(DIGITAL_SCORES_SEED);
    }
  }

  findAllCenters(): Promise<BenchmarkCenter[]> {
    return this.benchmarkCentersRepository.find({ order: { sortOrder: 'ASC' } });
  }

  findAllDigitalScores(): Promise<DigitalScore[]> {
    return this.digitalScoresRepository.find({ order: { sortOrder: 'ASC' } });
  }
}
