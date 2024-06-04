import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.use(cookieParser());

	const documentationConfig = new DocumentBuilder()
		.setTitle('API Gateway')
		.setDescription('Документация REST API')
		.setVersion('1.0.0')
		.build();

	const documentation = SwaggerModule.createDocument(
		app,
		documentationConfig,
	);

	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory: (errors: ValidationError[]) => {
				const messages: string[] = [];

				errors.forEach((item) => {
					for (const key in item.constraints) {
						const message = item.constraints[key];
						messages.push(message);
					}
				});

				return new BadRequestException([...messages]);
			},
		}),
	);

	SwaggerModule.setup('/api/docs', app, documentation);

	await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
