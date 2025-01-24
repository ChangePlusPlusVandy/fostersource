module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleFileExtensions: ["ts", "js", "json"],
	testMatch: ["<rootDir>/tests/**/*.test.ts"],
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.json",
		},
	},
	extensionsToTreatAsEsm: [],
	setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
