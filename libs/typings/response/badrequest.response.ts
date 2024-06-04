import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
	@ApiProperty({ example: ['Ошибка', 'Возможно еще одна'] })
	message: string[];

	@ApiProperty({ example: 'Not Found' })
	error: string;

	@ApiProperty({ example: HttpStatus.BAD_REQUEST })
	statusCode: HttpStatus;
}
