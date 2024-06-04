import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { Response } from 'express';
import { IRequest } from 'libs/typings/core/irequest';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateDto } from './dto/create.dto';
import { CreateResponse } from './response/create.response';
import { BadRequestResponse } from 'libs/typings/response/badrequest.response';
import { UnauthorizedResponse } from 'libs/typings/response/unauthorized.response';
import { UpdateDto } from './dto/update.dto';

@ApiTags('Статьи')
@Controller('/api/articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: 'Создать статью' })
	@ApiOkResponse({ type: CreateResponse })
	@ApiBadRequestResponse({ type: BadRequestResponse })
	@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
	@UseGuards(AuthGuard)
	@Post()
	public async create(
		@Res() res: Response,
		@Req() req: IRequest,
		@Body() body: CreateDto,
	) {
		const result = await this.articleService.create({
			...body,
			author: req.user.id,
		});

		res.status(HttpStatus.OK).json({ ...result });
	}

	@ApiOperation({ summary: 'Обновить статью' })
	@ApiOkResponse({ type: CreateResponse })
	@ApiBadRequestResponse({ type: BadRequestResponse })
	@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
	@UseGuards(AuthGuard)
	@Patch('/{id}')
	public async update(
		@Res() res: Response,
		@Req() req: IRequest,
		@Body() body: UpdateDto,
		@Param() params: { id: string },
	) {
		const result = await this.articleService.update({
			...body,
			articleId: params.id,
			author: req.user.id,
		});

		res.status(HttpStatus.OK).json({ ...result });
	}

	@ApiOperation({ summary: 'Удалить статью' })
	@ApiOkResponse()
	@ApiBadRequestResponse({ type: BadRequestResponse })
	@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
	@UseGuards(AuthGuard)
	@Delete('/{id}')
	public async delete(
		@Res() res: Response,
		@Req() req: IRequest,
		@Param() params: { id: string },
	) {
		await this.articleService.delete({
			articleId: params.id,
			author: req.user.id,
		});

		res.status(HttpStatus.OK).end();
	}

	@ApiOperation({ summary: 'Найти статью по ID' })
	@ApiOkResponse({ type: CreateResponse })
	@ApiBadRequestResponse({ type: BadRequestResponse })
	@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
	@UseGuards(AuthGuard)
	@Get('/{id}')
	public async findById(
		@Res() res: Response,
		@Param() params: { id: string },
	) {
		const result = await this.articleService.findById({
			id: params.id,
		});

		res.status(HttpStatus.OK).json(result);
	}
}
