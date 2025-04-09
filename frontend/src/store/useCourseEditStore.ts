import { create } from "zustand";

export type CourseType = "webinar" | "course" | "meeting";

interface CourseEditState {
	_id?: string;
	handouts: string[]; // storing ObjectId strings
	ratings: string[];
	className: string;
	discussion: string;
	components: any[]; // You can type this more strictly if needed
	isLive: boolean;
	categories: string[];
	creditNumber: number;
	courseDescription: string;
	thumbnailPath: string;
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	courseType: CourseType;
	lengthCourse: number;
	time: Date;
	isInPerson: boolean;
	students: string[]; // ObjectIds as strings
	managers: string[];
	regStart: Date;
	regEnd?: Date;
	productType: string[];
	shortUrl?: string;
	draft: boolean;

	// Methods
	setField: <K extends keyof CourseEditState>(
		key: K,
		value: CourseEditState[K]
	) => void;
	setAllFields: (data: Partial<CourseEditState>) => void;
	reset: () => void;
}

const initialState: Omit<
	CourseEditState,
	"setField" | "setAllFields" | "reset"
> = {
	_id: undefined,
	handouts: [],
	ratings: [],
	className: "",
	discussion: "",
	components: [],
	isLive: false,
	categories: [],
	creditNumber: 0,
	courseDescription: "",
	thumbnailPath: "",
	cost: 0,
	instructorName: "",
	instructorDescription: "",
	instructorRole: "",
	courseType: "course",
	lengthCourse: 0,
	time: new Date(),
	isInPerson: false,
	students: [],
	managers: [],
	regStart: new Date(),
	regEnd: undefined,
	productType: [],
	shortUrl: undefined,
	draft: true,
};

export const useCourseEditStore = create<CourseEditState>()((set) => ({
	...initialState,

	setField: (key, value) => set((state) => ({ ...state, [key]: value })),
	setAllFields: (data) =>
		set((state) => ({
			...state,
			...data,
		})),
	reset: () => set(() => ({ ...initialState })),
}));

export type CourseFormData = Omit<
	CourseEditState,
	"setField" | "setAllFields" | "reset"
>;

export const getCleanCourseData = (): CourseFormData => {
	const { setField, setAllFields, reset, ...courseData } =
		useCourseEditStore.getState();
	return courseData;
};
