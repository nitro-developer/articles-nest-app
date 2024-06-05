import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refreshtoken.entity';
import { JwtModule } from '@common/jwt';
import * as bcrypt from 'bcrypt';

const mock = {
	user: new User(),
};

describe('AuthService', () => {
	let service: AuthService;
	let userRepository: Repository<User>;
	let tokenRepository: Repository<RefreshToken>;

	beforeEach(async () => {
		/* Mock Data */
		mock.user.id = 'uuid-uuid-uuid-uuid';
		mock.user.login = 'superlogin';

		mock.user.salt = await bcrypt.genSalt();
		mock.user.password = await bcrypt.hash('ultramegahash', mock.user.salt);

		mock.user.createdAt = new Date();
		mock.user.updatedAt = new Date();

		const module: TestingModule = await Test.createTestingModule({
			imports: [JwtModule],
			providers: [
				AuthService,
				{
					provide: getRepositoryToken(User),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(RefreshToken),
					useClass: Repository,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		userRepository = module.get<Repository<User>>(getRepositoryToken(User));
		tokenRepository = module.get<Repository<RefreshToken>>(
			getRepositoryToken(RefreshToken),
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('signIn', () => {
		it('Поиск несуществующего пользователя', async () => {
			userRepository.findOne = jest.fn();
			jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

			const callFunc = service.signIn({
				login: 'qwerty',
				password: 'qwerty',
			});

			await expect(callFunc).rejects.toThrow(BadRequestException);
		});

		it('Поиск существующего пользователя', async () => {
			userRepository.findOne = jest.fn();
			tokenRepository.save = jest.fn();

			jest.spyOn(userRepository, 'findOne').mockResolvedValue(mock.user);
			jest.spyOn(tokenRepository, 'save');

			const callFunc = service.signIn({
				login: 'superlogin',
				password: 'ultramegahash',
			});

			await expect(callFunc).resolves.toEqual({
				accessToken: expect.any(String),
				refreshToken: expect.any(String),
			});
		});
	});

	describe('signUp', () => {
		it('Регистрация пользователя', async () => {
			userRepository.save = jest.fn();
			tokenRepository.save = jest.fn();

			jest.spyOn(userRepository, 'save').mockResolvedValue(mock.user);
			jest.spyOn(tokenRepository, 'save');

			const callFunc = service.signUp({
				login: 'superlogin',
				password: 'ultramegahash',
			});

			await expect(callFunc).resolves.toEqual({
				accessToken: expect.any(String),
				refreshToken: expect.any(String),
			});
		});
	});

	describe('signOut', () => {
		it('Выход из профиля', async () => {
			tokenRepository.findOne = jest.fn();

			jest.spyOn(tokenRepository, 'findOne').mockReturnValue(null);

			const callFunc = service.signOut({
				token: 'abc',
			});

			await expect(callFunc).resolves.toEqual(expect.any(Boolean));
		});
	});
});
