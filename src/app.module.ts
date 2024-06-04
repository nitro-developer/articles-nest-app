import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'libs/redis/redis.config';

import { TypeormModule } from '@common/typeorm';

import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
		CacheModule.registerAsync(RedisOptions),
		TypeormModule,
		AuthModule,
		ArticleModule,
	],
})
export class AppModule {}
