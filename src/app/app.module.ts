import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from 'src/auth/auth.module';
import { DiariesModule } from 'src/diaries/diaries.module';

const ATLAS_USERNAME = 'oAuthTory';
const REQ_LIMIT_INTERVAL_IN_SEC = 20;

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: REQ_LIMIT_INTERVAL_IN_SEC * 1000,
        limit: 10,
      },
    ]),
    UsersModule,
    DiariesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`mongodb+srv://${ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@oauthloginuserdb.8d3h0.mongodb.net/${process.env.ATLAS_DATABASE_NAME}?retryWrites=true&w=majority
`),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
