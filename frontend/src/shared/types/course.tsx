import { Rating } from "./rating";

export type Course = {
	handouts: string[];
	ratings: Rating[];
	className: string;
	discussion: string;
	components: String[];
	isLive: boolean;
	categories: string[];
	creditNumber: number;
	courseDescription: string;
	thumbnailPath: string;
	_id: string;
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	lengthCourse: number;
	time: Date;
	isInPerson: Boolean;
};
