export interface EmailTemplate {
	_id: string;
	subject: string;
	body: string;
}

export interface Email {
	id: string;
	subject: string;
	body: string;
	course: {
		id: string;
		className: string;
	};
	sendDate: string;
	selected: boolean;
}

export interface MongoEmail {
	_id: string;
	subject: string;
	body: string;
	course: {
		_id: string;
		className: string;
	};
	sendDate: string;
	selected: boolean;
}

export interface UserType {
	_id: string;
	name: string;
	userCount: number;
	cost: number;
}
