import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModule as Jwt } from '@nestjs/jwt';
@Module({
	imports: [Jwt.register({})],
	providers: [JwtService],
	exports: [JwtService],
})
export class JwtModule {}
