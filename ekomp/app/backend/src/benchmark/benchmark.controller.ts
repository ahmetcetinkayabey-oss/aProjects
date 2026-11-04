import { Controller, Get } from '@nestjs/common';
import { BenchmarkService } from './benchmark.service.js';
import { BenchmarkCenter } from './benchmark-center.entity.js';
import { DigitalScore } from './digital-score.entity.js';

@Controller('benchmark')
export class BenchmarkController {
  constructor(private readonly benchmarkService: BenchmarkService) {}

  @Get('centers')
  findAllCenters(): Promise<BenchmarkCenter[]> {
    return this.benchmarkService.findAllCenters();
  }

  @Get('digital-scores')
  findAllDigitalScores(): Promise<DigitalScore[]> {
    return this.benchmarkService.findAllDigitalScores();
  }
}
