import { Request } from 'express';
import { dateIso } from './dateiso';

export interface IRequest extends Request {
	user?: {
		id: string;
		login: string;
		createdAt: dateIso;
	};
}
