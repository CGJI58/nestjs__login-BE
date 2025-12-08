import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ThrottlerGuard)
  @Get()
  getCodeRequestURL() {
    console.log('Run getCodeRequestURL()');
    return this.appService.getCodeRequestURL();
  }
}
