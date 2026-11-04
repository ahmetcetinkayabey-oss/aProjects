import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facility } from './facility.entity.js';
import { FACILITIES_SEED } from './facilities.seed.js';

@Injectable()
export class FacilitiesService implements OnModuleInit {
  constructor(
    @InjectRepository(Facility)
    private readonly facilitiesRepository: Repository<Facility>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.facilitiesRepository.count();
    if (count === 0) {
      await this.facilitiesRepository.save(FACILITIES_SEED);
    }
  }

  findAll(): Promise<Facility[]> {
    return this.facilitiesRepository.find({ order: { sortOrder: 'ASC' } });
  }
}
