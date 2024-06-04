import { ISortType } from 'libs/typings/article/sort';

export class FindDto {
	page: number;
	sort?: {
		date?: ISortType;
		author?: ISortType;
	};
}
