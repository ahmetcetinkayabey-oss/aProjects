import { Controller, Get } from '@nestjs/common';

/** Barındırma sağlayıcısının (Render vb.) servisin ayakta olduğunu denetlemesi için. */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
