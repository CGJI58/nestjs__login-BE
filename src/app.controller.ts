import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('')
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  getCodeRequestURL() {
    return this.databaseService.getCodeRequestURL();
  }
}
