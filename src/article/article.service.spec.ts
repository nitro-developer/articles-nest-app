import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache, CacheModule } from '@nestjs/cache-manager';
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { RedisOptions } from '../../libs/redis/redis.config';

type IMock = {
	article: Article;
};
const mock: IMock = {
	article: {
		id: 'uuid-uuid-uuid-uuid',
		title: 'Заголовок',
		description: 'Какой то текст..',
		author: '1234-1234-1234-1234',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
};
describe('ArticleService', () => {
	let service: ArticleService;
	let articleRepository: Repository<Article>;
	let cacheManager: Cache;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [CacheModule.registerAsync(RedisOptions)],
			providers: [
				ArticleService,
				{
					provide: getRepositoryToken(Article),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<ArticleService>(ArticleService);
		articleRepository = module.get<Repository<Article>>(
			getRepositoryToken(Article),
		);
		cacheManager = module.get<Cache>(Cache);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('Создать статью с ошибками в DTO', async () => {
			articleRepository.save = jest.fn();
			jest.spyOn(articleRepository, 'save').mockRejectedValue(null);

			const callFunc = service.create({
				author: '1234-1234-1234-1234',
				//@ts-ignore
				title: 55123,
				description: 'Текст',
			});

			await expect(callFunc).rejects.toThrow(BadRequestException);
		});

		it('Создать статью', async () => {
			articleRepository.save = jest.fn();
			jest.spyOn(articleRepository, 'save').mockResolvedValue(
				mock.article,
			);

			const callFunc = service.create({
				author: '1234-1234-1234-1234',
				title: 'Текст',
				description: 'Текст',
			});

			await expect(callFunc).resolves.toBe(mock.article);
		});
	});

	describe('update', () => {
		it('Валидные данные', async () => {
			articleRepository.findOne = jest.fn();
			articleRepository.save = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(
				mock.article,
			);
			jest.spyOn(articleRepository, 'save').mockResolvedValue(
				mock.article,
			);

			const callFunc = service.update({
				title: 'Новый заголовок',
				description: 'Текст',
				articleId: mock.article.id,
				author: mock.article.author,
			});

			await expect(callFunc).resolves.toBe(mock.article);
		});

		it('Автор не совпадает', async () => {
			articleRepository.findOne = jest.fn();
			articleRepository.save = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(
				mock.article,
			);
			jest.spyOn(articleRepository, 'save').mockResolvedValue(
				mock.article,
			);

			const callFunc = service.update({
				title: 'Новый заголовок',
				description: 'Текст',
				articleId: mock.article.id,
				author: 'anyAuthor-uuid',
			});

			await expect(callFunc).rejects.toThrow(ForbiddenException);
		});

		it('Статья не найдена', async () => {
			articleRepository.findOne = jest.fn();
			articleRepository.save = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(null);
			jest.spyOn(articleRepository, 'save').mockResolvedValue(
				mock.article,
			);

			const callFunc = service.update({
				articleId: 'invalid-id',
				author: mock.article.author,
				title: '123',
				description: '123',
			});

			await expect(callFunc).rejects.toThrow(NotFoundException);
		});
	});

	describe('delete', () => {
		it('Успешно', async () => {
			articleRepository.findOne = jest.fn();
			articleRepository.delete = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(
				mock.article,
			);
			jest.spyOn(articleRepository, 'delete').mockResolvedValue(null);

			const callFunc = service.delete({
				articleId: mock.article.id,
				author: mock.article.author,
			});

			await expect(callFunc).resolves.toBe(null);
		});

		it('Автор не совпадает', async () => {
			articleRepository.findOne = jest.fn();
			articleRepository.delete = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(
				mock.article,
			);
			jest.spyOn(articleRepository, 'delete').mockResolvedValue(null);

			const callFunc = service.update({
				title: 'Новый заголовок',
				description: 'Текст',
				articleId: mock.article.id,
				author: 'anyAuthor-uuid',
			});

			await expect(callFunc).rejects.toThrow(ForbiddenException);
		});

		it('Статья не найдена', async () => {
			articleRepository.findOne = jest.fn();
			articleRepository.delete = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(null);
			jest.spyOn(articleRepository, 'delete').mockResolvedValue(null);

			const callFunc = service.delete({
				articleId: 'anyArticleId',
				author: mock.article.author,
			});

			await expect(callFunc).rejects.toThrow(NotFoundException);
		});
	});

	describe('findById', () => {
		it('Найти несуществующую статью', async () => {
			articleRepository.findOne = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(null);

			const callFunc = service.findById({ id: 'unknown-article-id' });

			await expect(callFunc).rejects.toThrow(NotFoundException);
		});

		it('Найти существующую статью', async () => {
			articleRepository.findOne = jest.fn();

			jest.spyOn(articleRepository, 'findOne').mockResolvedValue(
				mock.article,
			);

			const callFunc = service.findById({ id: mock.article.id });

			await expect(callFunc).resolves.toBe(mock.article);
		});
	});

	describe('find', () => {
		it('Найти несколько статей', async () => {
			articleRepository.find = jest.fn();

			const result: Article[] = new Array(10).fill(mock.article);

			jest.spyOn(articleRepository, 'find').mockResolvedValue(result);

			const callFunc = service.find({
				page: 13,
				sort: { date: 'asc', author: 'desc' },
			});

			await expect(callFunc).resolves.toBe(result);
		});
	});
});
