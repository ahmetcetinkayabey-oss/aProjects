import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateReservationDto } from './create-reservation.dto.js';

const valid = {
  organizationName: 'Örnek Spor Kulübü',
  contactName: 'Ali Veli',
  email: 'ali@example.com',
  phone: '+905551234567',
  sportBranch: 'Futbol',
};

async function errorsOf(input: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CreateReservationDto, input));
  return errors.map((e) => e.property);
}

describe('CreateReservationDto', () => {
  it('geçerli talebi kabul eder', async () => {
    expect(await errorsOf(valid)).toEqual([]);
  });

  it('boş gövdeyi reddeder', async () => {
    expect((await errorsOf({})).sort()).toEqual([
      'contactName',
      'email',
      'organizationName',
      'phone',
      'sportBranch',
    ]);
  });

  it('geçersiz e-posta ve telefonu reddeder', async () => {
    expect(
      (
        await errorsOf({ ...valid, email: 'e-posta-degil', phone: '123' })
      ).sort(),
    ).toEqual(['email', 'phone']);
  });

  it('aşırı uzun metinleri reddeder', async () => {
    expect(await errorsOf({ ...valid, message: 'a'.repeat(2001) })).toEqual([
      'message',
    ]);
    expect(
      await errorsOf({ ...valid, organizationName: 'a'.repeat(151) }),
    ).toEqual(['organizationName']);
  });

  it('kafile sayısı sınırlarını denetler', async () => {
    expect(await errorsOf({ ...valid, groupSize: 0 })).toEqual(['groupSize']);
    expect(await errorsOf({ ...valid, groupSize: 5000 })).toEqual([
      'groupSize',
    ]);
    expect(await errorsOf({ ...valid, groupSize: 40 })).toEqual([]);
  });
});
