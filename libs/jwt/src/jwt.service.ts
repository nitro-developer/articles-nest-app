import { Injectable } from '@nestjs/common';
import { JwtService as JWTService } from '@nestjs/jwt';

import { IJwtPayload } from 'libs/typings/jwt/payload';
@Injectable()
export class JwtService {
	constructor(private readonly jwtService: JWTService) {}

	/**
	 * Генерация пары токенов
	 * @param payload
	 * @returns
	 */
	public async generate(payload: IJwtPayload) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					...payload,
				},
				{
					secret: process.env.JWT_ACCESS_SECRET,
					expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
				},
			),
			this.jwtService.signAsync(
				{
					...payload,
				},
				{
					secret: process.env.JWT_REFRESH_SECRET,
					expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * Проверка валидности токена
	 * @param type - тип токена (access/refresh)
	 * @param token - токен
	 * @returns Promise<IJwtPayload | null>
	 */
	public async validate(
		type: 'access' | 'refresh',
		token: string,
	): Promise<IJwtPayload | null> {
		const secret =
			type === 'access'
				? process.env.JWT_ACCESS_SECRET
				: process.env.JWT_REFRESH_SECRET;

		try {
			const payload = <IJwtPayload>await this.jwtService.verifyAsync(
				token,
				{
					secret,
				},
			);
			return payload || null;
		} catch (error) {
			return null;
		}
	}
}
