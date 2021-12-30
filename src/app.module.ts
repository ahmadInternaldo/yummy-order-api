import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from './utils/auth/jwt-strategy';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.HOST,
      port: +process.env.PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      models: [Order],
      synchronize: true,
      sync: {
        alter: true
      },
      autoLoadModels: true
    }),
    SequelizeModule.forFeature([Order]),
    HttpModule,
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
