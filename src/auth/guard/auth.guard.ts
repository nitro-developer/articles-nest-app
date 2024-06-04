import { JwtService } from '@common/jwt';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { IRequest } from 'libs/typings/core/irequest';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext) {
		const req = <IRequest>context.switchToHttp().getRequest();

		const token = req.headers.authorization;

		if (!token) {
			throw new UnauthorizedException('Пользователь не автризован!');
		}

		const [bearer, jwtToken] = token.split(' ');

		if (bearer !== 'Bearer') {
			throw new UnauthorizedException('Пользователь не автризован!');
		}

		const user = await this.jwtService.validate('access', jwtToken);
		if (user === null) {
			throw new UnauthorizedException('Пользователь не автризован!');
		}

		req.user = user;
		return true;
	}
}
