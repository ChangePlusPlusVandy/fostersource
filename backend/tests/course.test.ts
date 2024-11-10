import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Course from "../models/courseModel";
import Rating from "../models/ratingModel";
import Survey from "../models/surveyModel";
import Video from "../models/videoModel";

const incompleteCourseData = {
    id: "01234"
}

const courseData1 = {
    id: "12345",
    handouts: [],
    ratings: [], 
    className: "Course A", 
    discussion: "", 
    components: []  
}

const courseData2 = {
    id: "23456",
    handouts: [], 
    ratings: [], 
    className: "Course B", 
    discussion: "", 
    components: []
}

describe("GET /api/courses", () => {
    beforeEach(async () => {
        await Course.create([courseData1, courseData2]);
    });

    it("should retrieve all courses", async () => {
        const res = await request(app).get("/api/courses");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
    }); 

    it("should retrieve courses by id", async () => {
        const res = await request(app).get("/api/courses").query({ courseId: "12345" });
        expect(res.statusCode).toBe(200);
        res.body.forEach((course: any) => {
            expect(course.id).toBe("12345"); 
        });
        expect(res.body.length).toBe(1);
    })

    it("should retrieve courses by name", async () => {
        const res = await request(app).get("/api/courses").query({ className: "Course A" });
        expect(res.statusCode).toBe(200);
        res.body.forEach((course: any) => {
            expect(course.className).toBe("Course A"); 
        });
        expect(res.body.length).toBe(2);
    }); 
}); 

describe("POST /api/courses", () => {
    it("should fail to create a new course if missing data", async () => {
        const res = await request(app).post("/api/courses").send(incompleteCourseData); 
        expect(res.statusCode).toBe(400); 
        expect(res.body.message).toBe("Please provide courseId, className, and components."); 
    }); 
    
    it("should create a new course if not exists", async () => {
        const res = await request(app).post("/api/courses").send(courseData1);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.className).toBe("Course A");
    }); 

    describe("when course already exists", () => {
        beforeEach(async () => {
            await request(app).post("/api/courses").send(courseData1);
        });
    
        it("should retrieve an existing course", async () => {
        const existingCourseData = {
            id: "12345",
            className: "Course A",
        };
    
        const res = await request(app).post("/api/courses").send(existingCourseData);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.className).toBe("Course A");
        expect(res.body.message).toBe("Course already exists");
        });
    })
}); 

describe("PUT /api/courses/:id", async () => {
    let courseId: string;
    beforeEach(async () => {
        const user = await Course.create<any>(courseData1);
        courseId = (user._id as mongoose.Types.ObjectId).toString();
    });

    it("should update a user", async () => {
        const updates = { className: "Course C" };
    
        const res = await request(app).put(`/api/users/${courseId}`).send(updates);
        expect(res.statusCode).toBe(200);
        expect(res.body.data.className).toBe("Course C");
    });

    it("should return 404 if user is not found", async () => {
        const invalidCourseId = new mongoose.Types.ObjectId();
        const res = await request(app)
          .put(`/api/users/${invalidCourseId}`)
          .send({ email: "Course X" });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Course entry not found.");
    });
});

describe("DELETE /api/courses/:id", async () => {
    let courseId: string; 
    let ratingId: string; 
    let componentId: string; 

    beforeEach(async () => {
        const course = await Course.create(courseData1); 
        courseId = (course._id as mongoose.Types.ObjectId).toString();

        const rating = await Rating.create({
            userId: "12345", 
            rating: "5",
        }); 
        ratingId = (rating._id as mongoose.Types.ObjectId).toString(); 

        const component = await Survey.create({
            // TODO: fill in survey once model is created 
        });
        componentId = (component._id as mongoose.Types.ObjectId).toString();
    });

    it("should delete course and associated ratings and components", async () => {
        const res = await request(app).delete(`/app/courses/${courseId}`); 
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(
          "Course and associated data deleted successfully."
        );

        const course = await Course.findById(courseId);
        expect(course).toBeNull(); 

        const rating = await Rating.findById(ratingId); 
        expect(rating).toBeNull(); 

        const component = await Survey.findById(componentId); 
        expect(component).toBeNull(); 
    }); 

    it("should return 404 if course not found", async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/courses/${nonExistentUserId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Course entry not found.");
    })
}); 