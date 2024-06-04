import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { uuid } from 'libs/typings/core/uuid';

export class FindByIdDto {
	@ApiProperty({ example: 'c0643c19-56f5-4cf9-855f-e86fe1841556' })
	@IsString({ message: 'ID статьи должен быть строкой!' })
	@IsNotEmpty({ message: 'ID статьи не может быть пустым!' })
	@IsUUID('4', { message: 'Неверный формат ID' })
	id: uuid;
}
