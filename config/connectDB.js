import dotenv from "dotenv";


dotenv.config();

console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // ✅ Debug if env var is loaded
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      process.exit(1);
    }
  };
 
export default connectDB;  