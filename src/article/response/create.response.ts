import { ApiProperty } from '@nestjs/swagger';

export class CreateResponse {
	@ApiProperty({ example: 'c0643c19-56f5-4cf9-855f-e86fe1841556' })
	id: string;

	@ApiProperty({ example: 'Какой-то заголовок' })
	title: string;

	@ApiProperty({ example: 'Текст статьи..' })
	description: string;

	@ApiProperty({ example: 'c0643c19-56f5-4cf9-855f-e86fe1841556' })
	author: string;

	@ApiProperty({ example: '2024-06-03 14:36:42.568' })
	createdAt: Date;

	@ApiProperty({ example: '2024-06-03 14:36:42.568' })
	updatedAt: Date;
}
