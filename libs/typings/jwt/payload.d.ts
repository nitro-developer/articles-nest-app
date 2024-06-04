import { uuid } from '../core/uuid';
import { dateIso } from '../core/dateiso';

export type IJwtPayload = {
	id: uuid;
	login: string;
	createdAt: dateIso;
};
