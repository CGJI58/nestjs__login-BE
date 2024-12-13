import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

const ATLAS_USERNAME = 'oAuthTory';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`mongodb+srv://${ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@oauthloginuserdb.8d3h0.mongodb.net/${process.env.ATLAS_DATABASE_NAME}?retryWrites=true&w=majority
`),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
