export type Rating = {
	userId: string;
	courseId: string;
	rating: number;
};

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
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	lengthCourse: number;
	time: Date;
	isInPerson: Boolean;
};
