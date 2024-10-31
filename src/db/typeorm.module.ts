import { Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
require('dotenv').config();

const entitiesPath = [__dirname + '/../**/*.entity{.ts,.js}'];

@Module({
  imports: [
    NestTypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: entitiesPath,
      autoLoadEntities: process.env.AUTOLOADENTITIES === 'true',
      synchronize: true,
    }),
  ],
})
export class TypeOrmModule {}
