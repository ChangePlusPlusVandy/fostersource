export type Payment = {
	userId: string;
	date: number;
	amount: number;
	memo: string;
	courses: string[]; 
	transactionId: string; 
};
