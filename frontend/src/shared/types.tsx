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

export interface ZoomMeeting {
	duration: number; // in minutes
	id: number; // Zoom meeting ID (integer)
	join_url: string;
	start_time: string; // ISO timestamp
	timezone: string; // e.g., "America/Denver"
	topic: string;
}
