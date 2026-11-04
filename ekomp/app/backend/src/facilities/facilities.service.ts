import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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
    // Yalnızca ilk kurulumda doldurulur; yönetici sonradan sildiği tesisler geri gelmez.
    if ((await this.facilitiesRepository.count()) === 0) {
      await this.facilitiesRepository.save(FACILITIES_SEED);
    }
  }

  findAll(): Promise<Facility[]> {
    return this.facilitiesRepository.find({ order: { sortOrder: 'ASC' } });
  }

  create(dto: Partial<Facility>): Promise<Facility> {
    return this.facilitiesRepository.save(this.facilitiesRepository.create(dto));
  }

  async update(id: string, dto: Partial<Facility>): Promise<Facility> {
    const item = await this.facilitiesRepository.findOneBy({ id });
    if (!item) throw new NotFoundException('Tesis bulunamadı.');
    return this.facilitiesRepository.save(Object.assign(item, dto));
  }

  async remove(id: string): Promise<void> {
    const result = await this.facilitiesRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Tesis bulunamadı.');
  }

  count(): Promise<number> {
    return this.facilitiesRepository.count();
  }
}
