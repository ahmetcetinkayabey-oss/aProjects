import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Erzurum Yüksek İrtifa Kamp Merkezi API';
  }
}
