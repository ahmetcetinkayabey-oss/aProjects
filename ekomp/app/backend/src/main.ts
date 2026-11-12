import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Vercel/Nginx gibi bir proxy arkasında gerçek istemci IP'si için TRUST_PROXY=1 verin (hız sınırı IP'ye göre çalışır).
  if (process.env.TRUST_PROXY)
    app.set(
      'trust proxy',
      Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY,
    );
  app.disable('x-powered-by');
  app.use(
    (
      _req: unknown,
      res: { setHeader(name: string, value: string): void },
      next: () => void,
    ) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // görseller farklı alan adından (frontend) yüklenir
      // API yanıtları ve yüklenen dosyalar sayfa değildir: doğrudan açılırlarsa hiçbir betik çalışamaz, çerçeveye alınamaz.
      res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Strict-Transport-Security', 'max-age=15552000');
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      next();
    },
  );
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // CORS_ORIGIN: virgülle ayrılmış tam adresler. Preview deploy'ları için CORS_ORIGIN_REGEX kullanılabilir.
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());
  const originRegex = process.env.CORS_ORIGIN_REGEX
    ? new RegExp(process.env.CORS_ORIGIN_REGEX)
    : null;
  app.enableCors({
    origin: (origin, cb) =>
      cb(
        null,
        !origin || origins.includes(origin) || !!originRegex?.test(origin),
      ),
  });
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
