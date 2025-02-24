export type QuestionType = {
    id: string;
    question: string;
    isMCQ: boolean;
    answers?: string[]; // Optional array of possible answers
    createdAt?: Date;
    updatedAt?: Date;
  };
  