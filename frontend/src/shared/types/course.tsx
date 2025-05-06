import { Rating } from "./rating";
import { User } from "./user";

export type Course = {
	handouts: string[];
	ratings: Rating[];
	className: string;
	discussion: string;
	categories: string[];
	creditNumber: number;
	courseDescription: string;
	thumbnailPath: string;
	_id: string;
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	time: Date;
	students: string[];
	regStart: Date;
	regEnd: Date;
	productType: string;
	productInfo: string;
};
