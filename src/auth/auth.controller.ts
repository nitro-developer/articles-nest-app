import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInDto } from './dto/signin.dto';
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInResponse } from './response/signin.response';
import { BadRequestResponse } from '../../libs/typings/response/badrequest.response';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './guard/auth.guard';
import { UnauthorizedResponse } from '../../libs/typings/response/unauthorized.response';

@ApiTags('Авторизация')
@Controller('api/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Авторизоваться в профиль' })
	@ApiOkResponse({
		type: SignInResponse,
	})
	@ApiBadRequestResponse({ type: BadRequestResponse })
	@Post('signin')
	async signIn(@Res() res: Response, @Body() body: SignInDto) {
		const { accessToken, refreshToken } =
			await this.authService.signIn(body);

		res.clearCookie('refreshToken');

		res.cookie('refreshToken', refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			secure: true,
			httpOnly: true,
		});

		res.status(HttpStatus.OK).json({ accessToken });
	}

	@ApiOperation({ summary: 'Выйти из профиля' })
	@ApiOkResponse()
	@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
	@UseGuards(AuthGuard)
	@Post('signout')
	async signOut(@Res() res: Response, @Req() req: Request) {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			res.status(HttpStatus.OK).end();
			return;
		}

		res.clearCookie('refreshToken');

		await this.authService.signOut({ token: refreshToken });
		res.status(HttpStatus.OK).end();
	}

	@ApiOperation({ summary: 'Зарегистрироваться' })
	@ApiOkResponse({
		type: SignInResponse,
	})
	@ApiBadRequestResponse({ type: BadRequestResponse })
	@Post('signup')
	async signUp(@Res() res: Response, @Body() body: SignUpDto) {
		const { accessToken, refreshToken } =
			await this.authService.signUp(body);

		res.clearCookie('refreshToken');

		res.cookie('refreshToken', refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			secure: true,
			httpOnly: true,
		});

		res.status(HttpStatus.OK).json({ accessToken });
	}

	@ApiOperation({ summary: 'Обновить токены авторизации' })
	@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
	@Get('refresh')
	async refresh(@Res() res: Response, @Req() req: Request) {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			throw new UnauthorizedException();
		}

		const result = await this.authService.refresh({ token: refreshToken });

		res.clearCookie('refreshToken');

		res.cookie('refreshToken', result.refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			secure: true,
			httpOnly: true,
		});

		res.status(HttpStatus.OK).json({ accessToken: result.accessToken });
	}
}
