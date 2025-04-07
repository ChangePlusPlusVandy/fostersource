import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGlobalSettings extends Document {
	selectedCategories: string[];
}

const GlobalSettingsSchema: Schema = new Schema(
	{
		selectedCategories: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true }
);

const GlobalSettings: Model<IGlobalSettings> = mongoose.model<IGlobalSettings>(
	"GlobalSettings",
	GlobalSettingsSchema
);

export default GlobalSettings;
