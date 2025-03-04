import { QuestionType } from "./question";
export type SurveyType = {
    id: string;
    questions: QuestionType[]; // Array of QuestionType objects
    createdAt?: Date;
    updatedAt?: Date;
  };
  