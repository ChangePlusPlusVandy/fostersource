import { QuestionType } from "./question";

export type SurveyType = {
	id: string;
	name: string;
	questions: QuestionType[];
	courseIds: string[];
	version: number;
	parentSurveyId?: string;
	isActive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
};
