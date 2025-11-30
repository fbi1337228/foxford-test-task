import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Привет! Спасибо за внимание к моему тестовому заданию.';
  }
}
