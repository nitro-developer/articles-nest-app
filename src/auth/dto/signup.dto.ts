import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignUpDto {
	@ApiProperty({ example: 'mySuperlogin', description: 'Логин' })
	@IsString({ message: 'Логин должен быть строкой!' })
	@IsNotEmpty({ message: 'Логин не может быть пустым!' })
	login: string;

	@ApiProperty({ example: 'mySuperPassword', description: 'Пароль' })
	@IsString({ message: 'Пароль должен быть строкой!' })
	@IsNotEmpty({ message: 'Пароль не может быть пустым!' })
	password: string;
}
