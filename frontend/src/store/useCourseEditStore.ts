import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CourseType = "webinar" | "course" | "meeting";

interface CourseEditState {
	_id?: string;
	handouts: string[];
	ratings: string[];
	className: string;
	discussion: string;
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
	time: Date;
	students: string[];
	managers: string[];
	speakers: string[];
	regStart: Date;
	regEnd?: Date;
	productType: string;
	productInfo: string;
	shortUrl?: string;
	draft: boolean;
	registrationLimit: number;

	// Hydration & data control
	hasHydrated: boolean;
	hasFetchedFromBackend: boolean;
	setHydrated: () => void;
	setFetchedFromBackend: () => void;

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
	| "setField"
	| "setAllFields"
	| "reset"
	| "hasHydrated"
	| "hasFetchedFromBackend"
	| "setHydrated"
	| "setFetchedFromBackend"
> = {
	_id: undefined,
	handouts: [],
	ratings: [],
	className: "",
	discussion: "",
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
	time: new Date(),
	students: [],
	managers: [],
	speakers: [],
	regStart: new Date(),
	regEnd: undefined,
	productType: "",
	productInfo: "",
	shortUrl: undefined,
	draft: true,
	registrationLimit: 0,
};

export const useCourseEditStore = create<CourseEditState>()(
	persist(
		(set) => {
			return {
				...initialState,
				hasHydrated: false,
				hasFetchedFromBackend: false,

				setHydrated: () => set({ hasHydrated: true }),
				setFetchedFromBackend: () => set({ hasFetchedFromBackend: true }),

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
						hasFetchedFromBackend: false,
					})),
			};
		},
		{
			name: "course-edit-store",
			storage: createJSONStorage(() => sessionStorage),

			onRehydrateStorage: (state) => {
				return (state) => {
					// Convert date strings back to Date objects after rehydration
					if (state) {
						if (typeof state.time === "string") {
							state.time = new Date(state.time);
						}
						if (typeof state.regStart === "string") {
							state.regStart = new Date(state.regStart);
						}
						if (typeof state.regEnd === "string") {
							state.regEnd = new Date(state.regEnd);
						}
						state.setHydrated(); // this is how Zustand recommends setting hydration flag
					}
				};
			},
		}
	)
);

export type CourseFormData = Omit<
	CourseEditState,
	| "setField"
	| "setAllFields"
	| "reset"
	| "hasHydrated"
	| "setHydrated"
	| "hasFetchedFromBackend"
	| "setFetchedFromBackend"
>;

export const getCleanCourseData = (): CourseFormData => {
	const {
		setField,
		setAllFields,
		reset,
		hasHydrated,
		setHydrated,
		hasFetchedFromBackend,
		setFetchedFromBackend,
		...courseData
	} = useCourseEditStore.getState();
	return courseData;
};
