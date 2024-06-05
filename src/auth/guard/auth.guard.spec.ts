import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@common/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{
					provide: JwtService,
					useValue: {
						validate: jest.fn(),
					},
				},
			],
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	describe('canActivate', () => {
		it('Токен отсутствует в headers', async () => {
			const context = {
				switchToHttp: () => ({
					getRequest: () => ({
						headers: {},
					}),
				}),
			};
			await expect(guard.canActivate(context as any)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('Токен есть в headers, но он не валиден формат записи', async () => {
			const context = {
				switchToHttp: () => ({
					getRequest: () => ({
						headers: {
							authorization: 'invalidToken',
						},
					}),
				}),
			};
			await expect(guard.canActivate(context as any)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('Токен есть, но у него вышел экспиренс', async () => {
			const jwtToken = 'validToken';
			const context = {
				switchToHttp: () => ({
					getRequest: () => ({
						headers: {
							authorization: `Bearer ${jwtToken}`,
						},
					}),
				}),
			};
			jwtService.validate = jest.fn().mockResolvedValue(null);
			await expect(guard.canActivate(context as any)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it('Токен валиден', async () => {
			const jwtToken = 'validToken';
			const user = {
				id: 1,
				username: 'testUser',
				createdAt: new Date().toISOString(),
			};

			const context = {
				switchToHttp: () => ({
					getRequest: () => ({
						headers: {
							authorization: `Bearer ${jwtToken}`,
						},
						user: user,
					}),
				}),
			};

			jwtService.validate = jest.fn().mockResolvedValue(user);

			const result = await guard.canActivate(context as any);
			expect(result).toBe(true);

			expect(context.switchToHttp().getRequest().user).toBe(user);
		});
	});
});
