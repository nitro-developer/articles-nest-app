import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';
import { FindDto } from './dto/find.dto';
import { ISortType } from 'libs/typings/article/sort';
import { FindByIdDto } from './dto/find-by-id.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArticleService {
	private readonly PAGE_STEP: number = 15;

	constructor(
		@InjectRepository(Article)
		private readonly articleRepository: Repository<Article>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	public async create(body: CreateDto) {
		const { author, title, description } = body;

		const article = new Article();

		article.title = title;
		article.author = author;
		article.description = description;

		try {
			return await this.articleRepository.save(article);
		} catch (error) {
			throw new BadRequestException();
		}
	}

	public async update(body: UpdateDto) {
		const article = await this.articleRepository.findOne({
			where: { id: body.articleId },
		});

		if (!article) {
			throw new NotFoundException('Статья не найдена!');
		}

		if (article.author !== body.author) {
			throw new ForbiddenException(
				'Вы не являетесь автором данной статьи!',
			);
		}

		['title', 'description'].forEach((el) => {
			if (article[el] !== body[el]) article[el] = body[el];
		});

		const cached = await this.cacheManager.get(`article:${article.id}`);

		if (cached) {
			await this.cacheManager.set(`article:${article.id}`, article, 30);
		}

		try {
			return await this.articleRepository.save(article);
		} catch (error) {
			throw new BadRequestException();
		}
	}

	public async delete(body: DeleteDto) {
		const article = await this.articleRepository.findOne({
			where: { id: body.articleId },
		});

		if (!article) {
			throw new NotFoundException('Статья не найдена!');
		}

		if (article.author !== body.author) {
			throw new ForbiddenException(
				'Вы не являетесь автором данной статьи!',
			);
		}

		const cached = await this.cacheManager.get(`article:${article.id}`);

		if (cached) {
			await this.cacheManager.del(`article:${article.id}`);
		}

		try {
			return await this.articleRepository.delete({ id: article.id });
		} catch (error) {
			throw new BadRequestException();
		}
	}

	public async find(body: FindDto) {
		const order: { date?: ISortType; author?: ISortType } = {};

		const page = Number(body.page);
		const skip = this.PAGE_STEP * page - this.PAGE_STEP;

		if (body?.sort) {
			['date', 'author'].forEach((el) => {
				if (body.sort?.[el]) order[el] = body.sort[el];
			});
		}

		const articles = await this.articleRepository.find({
			take: this.PAGE_STEP,
			skip,
			order,
		});

		return articles;
	}

	public async findById(body: FindByIdDto) {
		const { id } = body;

		const cached: Article = await this.cacheManager.get(`article:${id}`);
		if (cached) return cached;

		const article = await this.articleRepository.findOne({ where: { id } });
		if (!article) {
			throw new NotFoundException();
		}

		await this.cacheManager.set(`article:${id}`, article, 30);

		return article;
	}
}
