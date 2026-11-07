import { describe, expect, it } from 'vitest';
import { decryptSecret, encryptSecret } from './settings-crypto.js';

describe('settings-crypto', () => {
  it('şifreleyip aynı anahtarla geri çözer; düz metin saklamaz', () => {
    const stored = encryptSecret('xsmtpsib-gizli', 'anahtar');
    expect(stored.startsWith('enc:')).toBe(true);
    expect(stored).not.toContain('gizli');
    expect(decryptSecret(stored, 'anahtar')).toBe('xsmtpsib-gizli');
  });

  it('yanlış anahtarla çözülemez (null döner)', () => {
    expect(decryptSecret(encryptSecret('a', 'k1'), 'k2')).toBeNull();
  });

  it('şifrelenmemiş eski değeri olduğu gibi döndürür', () => {
    expect(decryptSecret('duz', 'k')).toBe('duz');
  });
});
