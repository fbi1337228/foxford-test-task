import { ConfigService } from '@nestjs/config';

// Проверяет, находится ли приложение в режиме разработки
export function isDev(configService: ConfigService): boolean {
  return configService.getOrThrow<string>('NODE_ENV') === 'development';
};
