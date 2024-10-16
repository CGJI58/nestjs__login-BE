import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [DatabaseService],
})
export class AppModule {}
