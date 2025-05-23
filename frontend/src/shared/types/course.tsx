import { Rating } from "./rating";
import { User } from "./user";

export type Course = {
	_id: string;
	handouts: string[];
	ratings: Rating[];
	className: string;
	discussion: string;
	isLive: boolean;
	categories: string[];
	creditNumber: number;
	courseDescription: string;
	thumbnailPath: string;
	bannerPath: string;
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	time: Date;
	students: string[];
	managers: string[];
	speakers: string[];
	regStart: Date;
	regEnd: Date;
	productType:
		| "Virtual Training - Live Meeting"
		| "In-Person Training"
		| "Virtual Training - On Demand"
		| "Virtual Training - Live Webinar";
	productInfo: string;
	shortUrl: string;
	draft: boolean;
};
