import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig() {
    const clientId = this.configService.get<string>('CLIENT_ID');
    return { clientId };
  }
}
