import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDto {
	@ApiProperty({ example: 'Событие!', description: 'Заголовок' })
	@IsString({ message: 'Заголовок должен быть строкой!' })
	@IsNotEmpty({ message: 'Заголовок не может быть пустым!' })
	title: string;

	@ApiProperty({
		example: 'Поговорим о важном..',
		description: 'Текст статьи',
	})
	@IsString({ message: 'Текст статьи должен быть строкой!' })
	@IsNotEmpty({ message: 'Текст статьи не может быть пустым!' })
	description: string;

	author: string;
}
