import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), '.env') });

console.log(`${process.env.POSTGRES_DB} | ${process.env.POSTGRES_DB || 'db'}`);

const options = (): DataSourceOptions => {
	const isLogging: boolean = process.env.NODE_ENV === 'development';

	return {
		host: process.env.POSTGRES_HOST || 'localhost',
		port: Number(process.env.POSTGRES_PORT) || 5432,
		username: process.env.POSTGRES_USER || 'postgres',
		password: process.env.POSTGRES_PASSWORD || 'postgres',
		database: process.env.POSTGRES_DB || 'db',
		type: 'postgres',
		schema: 'public',
		logging: isLogging,
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
				'common',
				'migrations',
				'*-migration.js',
			),
		],
		migrationsRun: true,
		migrationsTableName: 'migrations',
	};
};

export const appDataSource = new DataSource(options());
