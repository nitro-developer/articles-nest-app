import { Article } from '../../article/entities/article.entity';

import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Index({ unique: true })
	@Column()
	login: string;

	@Column()
	password: string;

	@Column()
	salt: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@OneToMany(() => Article, (article) => article.author)
	articles: Article[];
}
