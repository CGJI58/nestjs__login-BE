import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from 'src/auth/auth.module';

const ATLAS_USERNAME = 'oAuthTory';
const REQ_LIMIT_INTERVAL = 60;

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: REQ_LIMIT_INTERVAL * 1000,
        limit: 30,
      },
    ]),
    UsersModule,
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
