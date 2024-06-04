import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
	@ApiProperty({ example: 'Пользователь не автризован!' })
	message: string;

	@ApiProperty({ example: 'Unauthorized' })
	error: string;

	@ApiProperty({ example: HttpStatus.UNAUTHORIZED })
	statusCode: HttpStatus;
}
