import mongoose from "mongoose"

const UserSchema = new mongoose.Schema ({
    name: String,
    email: String, 
    password: String,
    profilePicture: String,
    proficiency: {type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true},
    progress: {
        course1: { completedExercises: [{ type: String, default:[] }] }, // Track completed exercises
        course2: { completedExercises: [{ type: String, default:[] }]},
        course3: { completedExercises: [{ type: String, default:[]}] }
    }
})

const userModel = mongoose.model("users", UserSchema)
export default userModel