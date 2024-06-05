import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });

const configService = new ConfigService();

const options = (): DataSourceOptions => {
	const isLogging: boolean = configService.get('NODE_ENV') === 'development';

	return {
		host: configService.get('POSTGRES_HOST') || 'localhost',
		port: Number(configService.get('POSTGRES_PORT')) || 5432,
		username: configService.get('POSTGRES_USER') || 'postgres',
		password: configService.get('POSTGRES_PASSWORD') || 'postgres',
		database: configService.get('POSTGRES_DB') || 'qti123m',
		type: 'postgres',
		schema: 'public',
		logging: false,
		entities: [
			join(
				process.cwd(),
				'dist',
				'src',
				'**',
				'entities',
				'*.entity.{js,ts}',
			),
		],
		migrations: [
			join(
				process.cwd(),
				'dist',
				'src',
				'migrations',
				'*-migration.{ts,js}',
			),
		],
		migrationsRun: true,
		migrationsTableName: 'migrations',
	};
};

export const appDataSource = new DataSource(options());
