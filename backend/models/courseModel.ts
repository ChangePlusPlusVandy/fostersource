import mongoose, { Schema, Document, Model } from "mongoose";
import { IRating } from "./ratingModel";


export interface ICourse extends Document {
    handouts: string[];
    ratings: IRating[];
    className: string;
    discussion: string;
    components: Object[];
    isLive: boolean;
    categories: string[];
    creditNumber: number;
    courseDescription: string;
    thumbnailPath: string;
    cost: number;
    instructorName: string;
    instructorDescription: string;
    instructorRole: string;
    lengthCourse: number;
    time: Date;
	isInPerson: boolean;
    students: mongoose.Types.ObjectId[]; //for the users
     }


const CourseSchema: Schema = new Schema(
    {
        handouts: [{ type: String, required: false }],
        ratings: [
            {
                type: Schema.Types.ObjectId,
                ref: "Rating",
            },
        ],
        className: { type: String, required: true },
        discussion: { type: String, required: false },
        components: [{ type: Schema.Types.Mixed, required: false }],
        isLive: { type: Boolean, required: true },
        categories: [{ type: String, required: false }],
        creditNumber: { type: Number, required: true },
        courseDescription: { type: String, required: true },
        thumbnailPath: { type: String, required: true },
        cost: { type: Number, required: true },
        instructorDescription: {type: String, required: false},
        instructorRole: {type: String, required: false},
        lengthCourse: {type: Number, required: true},
        time: {type: Date, required: true},
        instructorName: {type: String, required: true},
		isInPerson: {type: Boolean, required: true},
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ]
    },
    {
        timestamps: true,
    }
);


const Course: Model<ICourse> = mongoose.model<ICourse>("Course", CourseSchema);


export default Course;



