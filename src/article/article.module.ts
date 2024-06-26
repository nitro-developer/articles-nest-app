import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { JwtModule } from '@common/jwt';
import { User } from 'src/auth/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Article]), JwtModule],
	providers: [ArticleService],
	controllers: [ArticleController],
})
export class ArticleModule {}
