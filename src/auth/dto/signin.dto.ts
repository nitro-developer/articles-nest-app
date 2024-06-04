import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
	@ApiProperty({ example: 'mySuperlogin', description: 'Логин' })
	@IsString({ message: 'Логин должен быть строкой!' })
	@IsNotEmpty({ message: 'Логин не может быть пустым!' })
	login: string;

	@ApiProperty({ example: 'pa$$word', description: 'Пароль' })
	@IsString({ message: 'Пароль должен быть строкой!' })
	@IsNotEmpty({ message: 'Пароль не может быть пустым!' })
	password: string;
}
