export type QuestionType = {
	id: string;
	question: string;
	explanation?: string;
	answerType: "Text Input" | "Multiple Choice" | "Multi-select";
	answers?: string[];
	isRequired: boolean;
	phase?: "pre" | "post";
	createdAt?: Date;
	updatedAt?: Date;
};
