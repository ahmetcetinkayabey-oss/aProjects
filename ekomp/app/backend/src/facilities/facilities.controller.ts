import { Controller, Get } from '@nestjs/common';
import { FacilitiesService } from './facilities.service.js';
import { Facility } from './facility.entity.js';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get()
  findAll(): Promise<Facility[]> {
    return this.facilitiesService.findAll();
  }
}
