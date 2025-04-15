import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CourseType = "webinar" | "course" | "meeting";

interface CourseEditState {
	_id?: string;
	handouts: string[];
	ratings: string[];
	className: string;
	discussion: string;
	components: any[];
	isLive: boolean;
	categories: string[];
	creditNumber: number;
	courseDescription: string;
	thumbnailPath: string;
	bannerPath: string;
	cost: number;
	instructorName: string;
	instructorDescription: string;
	instructorRole: string;
	courseType: CourseType;
	lengthCourse: number;
	time: Date;
	isInPerson: boolean;
	students: string[];
	managers: string[];
	speakers: string[];
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
	bannerPath: "",
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
	speakers: [],
	regStart: new Date(),
	regEnd: undefined,
	productType: [],
	shortUrl: undefined,
	draft: true,
};

export const useCourseEditStore = create<CourseEditState>()(
	persist(
		(set) => ({
			...initialState,

			setField: (key, value) =>
				set((state) => ({
					...state,
					[key]: value,
				})),

			setAllFields: (data) =>
				set((state) => ({
					...state,
					...data,
				})),

			reset: () =>
				set(() => ({
					...initialState,
				})),
		}),
		{
			name: "course-edit-store",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);

export type CourseFormData = Omit<
	CourseEditState,
	"setField" | "setAllFields" | "reset"
>;

export const getCleanCourseData = (): CourseFormData => {
	const { setField, setAllFields, reset, ...courseData } =
		useCourseEditStore.getState();
	return courseData;
};
