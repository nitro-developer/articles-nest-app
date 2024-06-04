import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@common/jwt';
import { RefreshToken } from './entities/refreshtoken.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, RefreshToken]), JwtModule],
	providers: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
