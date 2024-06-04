import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@common/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshtoken.entity';
import { SignInDto } from './dto/signin.dto';
import { IJwtPayload } from 'libs/typings/jwt/payload';

import * as bcrypt from 'bcrypt';
import { SignOutDto } from './dto/signout.dto';
import { SignUpDto } from './dto/signup.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ValidateDto } from './dto/validate.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(RefreshToken)
		private readonly tokenRepository: Repository<RefreshToken>,
		private readonly jwtService: JwtService,
	) {}

	public async signIn(body: SignInDto) {
		const { login, password } = body;

		const user = await this.userRepository.findOne({ where: { login } });
		if (!user) {
			throw new BadRequestException('Пользователь не найден!');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new BadRequestException(
				'Неверное имя пользователя или пароль!',
			);
		}

		return await this.generateTokens(user);
	}

	public async signOut(body: SignOutDto) {
		const { token } = body;

		const tokenExsists = await this.tokenRepository.findOne({
			where: { token },
		});
		if (!tokenExsists) return true;

		try {
			await this.tokenRepository.delete({ id: tokenExsists.id });
		} catch (error) {}

		return true;
	}

	public async signUp(body: SignUpDto) {
		const { login, password } = body;

		const user = new User();

		user.login = login;
		user.salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(password, user.salt);

		let savedUser: User = null;

		try {
			savedUser = await this.userRepository.save(user);
		} catch (error) {
			throw new BadRequestException(
				'Ошибка при сохранении пользователя!',
			);
		}

		return await this.generateTokens(savedUser);
	}

	public async refresh(body: RefreshDto) {
		const { token } = body;

		const payload = await this.validate({ type: 'refresh', token });

		if (!payload) {
			throw new UnauthorizedException('Пользователь не авторизован!');
		}

		const tokenExsists = await this.tokenRepository.findOne({
			where: { token },
		});

		if (!tokenExsists) {
			throw new UnauthorizedException('Пользователь не авторизован!');
		}

		const user = await this.userRepository.findOne({
			where: { id: payload.id },
		});

		if (!user) {
			throw new UnauthorizedException('Пользователь не найден!');
		}

		try {
			await this.tokenRepository.delete({ id: tokenExsists.id });
		} catch (error) {
			throw new BadRequestException('Ошибка при удалении токена');
		}

		return await this.generateTokens(user);
	}

	public async validate(body: ValidateDto) {
		const { type, token } = body;
		return await this.jwtService.validate(type, token);
	}

	private async generateTokens(user: User) {
		const payload: IJwtPayload = {
			id: user.id,
			login: user.login,
			createdAt: user.createdAt.toISOString(),
		};

		const { accessToken, refreshToken } =
			await this.jwtService.generate(payload);

		const token = new RefreshToken();
		token.token = refreshToken;

		try {
			await this.tokenRepository.save(token);
		} catch (error) {
			throw new BadRequestException('Ошибка в сохранении Refresh Token');
		}

		return {
			accessToken,
			refreshToken,
		};
	}
}
