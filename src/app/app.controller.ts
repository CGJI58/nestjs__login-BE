import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('')
@UseGuards(ThrottlerGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getCodeRequestURL() {
    console.log('Run getCodeRequestURL()');
    return this.appService.getCodeRequestURL();
  }
}
