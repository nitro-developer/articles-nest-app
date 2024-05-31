import { Module } from '@nestjs/common';
import { TypeormModule } from '@common/typeorm';

import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [TypeormModule, AuthModule, ArticleModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
