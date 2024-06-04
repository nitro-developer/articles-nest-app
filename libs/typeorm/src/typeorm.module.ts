import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource } from './ormconfig';

@Module({
	imports: [TypeOrmModule.forRoot(appDataSource.options)],
})
export class TypeormModule {}
