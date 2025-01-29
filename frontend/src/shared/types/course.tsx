import { Rating } from "./rating";

export type Course = {
	className: string;
	description: string;
	instructor: string;
	creditNumber: number;
	discussion: string;
	components: any[];
	handouts: string[];
	ratings: Rating[];
	isLive: boolean;
	cost: number;
	categories: string[];
	thumbnailPath: string;
};
