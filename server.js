import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { exec } from "child_process";
import mongoose from "mongoose";
import userModel from "./models/user.js"; // Ensure this file uses ES6 exports
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcryptjs";

import connectDB from "./config/connectDB.js"; // Ensure this path is correct


import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5001;


console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // ✅ Debug if env var is loaded

  
  

const app = express();

(async () => {
    console.log("🛠 Connecting to Database...");
    await connectDB();
  })();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("🔍 Incoming Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No token provided or incorrect format");
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("✅ Decoded Token:", decoded);

        req.user = { id: decoded.userId }; // Correct assignment
        next();
    } catch (err) {
        console.log("❌ Token verification failed:", err.message);
        res.status(401).json({ message: "Invalid token" });
    }
};





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");  // Save files in the "uploads" directory
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // Extract file extension
      cb(null, Date.now() + ext); // Rename file with timestamp + extension
    }
  });

const upload=multer({storage: storage});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const allowedOrigins = [
    "http://localhost:5173", // Local development
    "https://codepy-frontend.onrender.com" // Render frontend
];

// Enable CORS with the specific methods and headers
app.use(cors({
  origin: allowedOrigins,  // Allow only your frontend's origin
  methods: ["GET", "POST", "OPTIONS"],  // Allow the necessary HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allow the necessary headers
}));

app.use(bodyParser.json());



// Function to evaluate the user's code safely
const executePythonCode = (code, callback) => {
  exec(`python -c "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
    if (error || stderr) {
      callback(stderr || error.message);
    } else {
      callback(stdout.trim());
    }
  });
};

app.post("/login", async (req, res) => {
    console.log("🔍 Login API hit"); 
    console.log("📩 Request Body:", req.body);

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name, proficiency: user.proficiency },
            process.env.SECRET_KEY,  // Use environment variable
            { expiresIn: "1h" }
        );

        res.json({
            message: "Success",
            user: { name: user.name, email: user.email, proficiency: user.proficiency },
            token: token
        });

    } catch (error) {
        console.error("🔥 Error in Login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const SECRET_KEY = "your_jwt_secret_key"; // Change this to a secure key

app.post("/register", upload.single("profilePicture"), async (req, res) => {
    const { name, email, password, proficiency } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    console.log("📂 Received File:", req.file);
    console.log("📥 Received Body:", req.body);

    if (!req.file) {
        return res.status(400).json({ error: "Profile picture upload failed." });
    }

    // Validate input
    if (!proficiency) {
        return res.status(400).json({ error: "Proficiency level is required." });
    }

    try {
        // Check if user already exists
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        // Hash password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword, // Store hashed password
            proficiency,
            profilePicture,
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,  // Use .env for security
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User successfully registered",
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                proficiency: user.proficiency,
            },
            token, // Send token to frontend
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});


app.use("/uploads", express.static(path.join(path.dirname(new URL(import.meta.url).pathname), "uploads")));
app.use("/uploads", express.static("uploads")); // Serve images

app.get("/user-profile", verifyToken, async (req, res) => {
    console.log("🔍 User Profile API Hit"); // Debugging log
    console.log("🛠 Token User:", req.user);
    try {
        // Get the email from the decoded token
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.post("/update-progress", async (req, res) => {
    console.log("Received request at /update-progress with body:", req.body); // Log request body // Debugging log
    const { email, course, exerciseId } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User Progress:", user.progress);

        // Prevent duplicates
        if (!user.progress[course].completedExercises.includes(exerciseId)) {
            user.progress[course].completedExercises.push(exerciseId);
            await user.save();
        }

        res.json({ message: "Progress updated successfully", progress: user.progress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.get("/get-progress/:userEmail", async (req, res) => {
    const { userEmail } = req.params;

    try {
        const user = await userModel.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        

        res.json({ progress: user.progress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// API to validate exercise solution
app.post("/validate-solution", (req, res) => {
  const { code, exerciseId } = req.body;

  // Define correct solutions for each exercise
  const correctSolutions = {
    "exercise1": "Hello World!",
    "exercise2": "HELLO_CHECK",
    "exercise4": "You take away its chair",
    "exercise5": "todays_date = ",
    "exercise6": "PRODUCT_CHECK",
    "exercise7": "COMMENT_CHECK",
    "exercise8": "FLOAT_CHECK",
    "exercise9": "BOOLEAN_CHECK",
    "exercise10": "VALUE_ERROR_CHECK",
    "exercise1final": "1REVIEW_CHECK",
    "exercise21": "ARGS_CHECK",
    "exercise22": "WORKING_CHECK",
    "exercise23": "KWARGS_CHECK",
    "exercise24": "KWARGS2_CHECK",
    "exercise25": "ALL_CHECK",
    "exercise31": "TUPLE_CHECK",
    "exercise32": "LAMBDA_CHECK",
    "exercise33": "FILTER_CHECK",
    "exercise34": "MAP_FILTER_CHECK",
    "exercise35": "MAP_REDUCE_CHECK",
    "exercise36": "2REVIEW_CHECK"
  };

  executePythonCode(code, (output) => {
    if (exerciseId === "exercise2") {
      // For exercise3, just check if there is any output
      if (output.startsWith("Hello")) {
        res.json({ success: true, message: "Correct! You may proceed." });
      } else {
        res.json({ success: false, message: 'Incorrect! Make sure your output starts with "Hello".' });
      }
    } 
    else if (exerciseId === "exercise4") {
        // For exercise5, check if output matches the expected joke text
        const expectedOutput = `You take away its chair`;
        if (output.trim() === expectedOutput) {
          res.json({ success: true, message: "Correct! You successfully debugged the code." });
        } else {
          res.json({ success: false, message: "Incorrect! Make sure the print statement match the expected output." });
        }
    }
    else if (exerciseId === "exercise5") {
        // Check if the user assigned any value to the variable "todays_date"
        if (code.includes("todays_date =")) {
          res.json({ success: true, message: "Correct! You may proceed." });
        } else {
          res.json({ success: false, message: "Incorrect! Make sure you define the variable 'todays_date'." });
        }
    }   
    else if (exerciseId === "exercise6") {
            // Regular expression to check if `product = X * Y` where X and Y are integers
            const multiplicationRegex = /^product\s*=\s*\d+\s*\*\s*\d+\s*$/;
        
            if (multiplicationRegex.test(code)) {
              res.json({ success: true, message: "Correct! You may proceed." });
            } else {
              res.json({ success: false, message: "Incorrect! Make sure you assign the product of two numbers to 'product'." });
            }
    }
    else if (exerciseId === "exercise7") {
        // Trim spaces and check if the code starts with '#' and contains 'population'
        const trimmedCode = code.trim();
        if (trimmedCode.startsWith("#") && trimmedCode.toLowerCase().includes("population")) {
            res.json({ success: true, message: "Correct! You may proceed." });
        } else {
            res.json({ success: false, message: "Incorrect! Your comment should start with # and mention 'population'." });
        }
    }
    else if (exerciseId === "exercise8") {  
      let errors = [];  
  
      if (!/cucumbers\s*=\s*100/.test(code)) {  
          errors.push("Error: Make sure you have defined 'cucumbers = 100'.");  
      }  
  
      if (!/num_people\s*=\s*6/.test(code)) {  
          errors.push("Error: Ensure that 'num_people = 6' is correctly assigned.");  
      }  
  
      if (!/whole_cucumbers_per_person\s*=\s*cucumbers\s*\/\/\s*num_people/.test(code)) {  
          errors.push("Error: Whole number division should be written as 'whole_cucumbers_per_person = cucumbers // num_people'.");  
      }  
  
      if (!/float_cucumbers_per_person\s*=\s*float\(\s*cucumbers\s*\)\s*\/\s*num_people/.test(code)) {  
          errors.push("Error: Floating-point division must use 'float(cucumbers) / num_people'.");  
      }  
  
      if (!/print\s*\(\s*whole_cucumbers_per_person\s*\)/.test(code)) {  
          errors.push("Error: Missing 'print(whole_cucumbers_per_person)'. Ensure you're printing the integer result.");  
      }  
  
      if (!/print\s*\(\s*float_cucumbers_per_person\s*\)/.test(code)) {  
          errors.push("Error: Missing 'print(float_cucumbers_per_person)'. Make sure you're printing the floating-point result.");  
      }  
  
      if (errors.length === 0) {  
          res.json({ success: true, message: "Correct! You may proceed." });  
      } else {  
          res.json({ success: false, message: errors });  
      }  
  }
  else if (exerciseId === "exercise9") {
        const correctAnswer = "age_is_12 = False";  // Expected output
        
        if (code.includes(correctAnswer)) {
            res.json({ success: true, message: "Correct! You may proceed." });
        } else {
            res.json({ success: false, message: "Incorrect! The person is 21, so age_is_12 should be False." });
        }
    }
    else if (exerciseId === "exercise10") {
        // Ensure "product" is assigned using float multiplication
        const productPattern = /product\s*=\s*float\(\s*float_1\s*\*\s*float_2\s*\)/;
        
        // Ensure "print" statement follows the format
        const printPattern = /print\(\s*"The product was",\s*product\s*\)/;

        if (productPattern.test(code) && printPattern.test(code)) {
            res.json({ success: true, message: "Correct! You may proceed." });
        } else {
            res.json({ success: false, message: "Incorrect! Ensure product is a float and printed correctly using print()." });
        }
    
    }

    else if (exerciseId === "exercise1final") {  
      let errors = [];  
  
      // Ensure product is set correctly  
      if (!/product\s*=\s*"Python Syntax"/.test(code)) {  
          errors.push("Error: 'product' should be assigned as 'product = \"Python Syntax\"'.");  
      }  
  
      // Ensure exercises_completed is correct  
      if (!/exercises_completed\s*=\s*13/.test(code)) {  
          errors.push("Error: 'exercises_completed' must be set to 13.");  
      }  
  
      // Ensure points_per_exercise is correct  
      if (!/points_per_exercise\s*=\s*5/.test(code)) {  
          errors.push("Error: 'points_per_exercise' must be set to 5.");  
      }  
  
      // Ensure point_total is updated correctly  
      if (!/point_total\s*\+=\s*exercises_completed\s*\*\s*points_per_exercise/.test(code)) {  
          errors.push("Error: Ensure 'point_total' is updated using 'point_total += exercises_completed * points_per_exercise'.");  
      }  
  
      // Ensure comment exists above points_per_exercise  
      if (!/#\s*The product was X\s*\n\s*points_per_exercise\s*=/.test(code)) {  
          errors.push("Error: Missing or incorrect comment above 'points_per_exercise'. It should be '# The product was X'.");  
      }  
  
      // Ensure print statement follows the correct format  
      if (!/print\(\s*"The product was",\s*point_total\s*\)/.test(code)) {  
          errors.push("Error: The print statement should be 'print(\"The product was\", point_total)'.");  
      }  
  
      // Check if all requirements are met  
      if (errors.length === 0) {  
          res.json({ success: true, message: "Correct! You may proceed." });  
      } else {  
          res.json({ success: false, message: errors });  
      }  
  }
  

    else if (exerciseId === "exercise21") {  
      // Check if function is defined with the unpacking operator (*)  
      const functionPattern = /def\s+print_order\s*\(\s*\*order_items\s*\)\s*:/;  
      const printPattern = /print\s*\(\s*order_items\s*\)/;  
  
      // Check if function is called correctly with the given items  
      const callPattern = /print_order\s*\(\s*['"]Orange Juice['"]\s*,\s*['"]Apple Juice['"]\s*,\s*['"]Scrambled Eggs['"]\s*,\s*['"]Pancakes['"]\s*\)/;  
  
      if (  
          functionPattern.test(code) &&  
          printPattern.test(code) &&  
          callPattern.test(code)  
      ) {  
          res.json({ success: true, message: "Correct! Your function properly takes and prints a variable number of order items." });  
      } else {  
          res.json({ success: false, message: "Incorrect! Ensure you define the function with *order_items and call it with the correct items." });  
      }  
  }

  else if (exerciseId === "exercise22") {  
    let errors = [];

    // Ensure 'tables' dictionary is defined properly with correct values for Table 1
    const tablesPattern = /tables\s*=\s*{\s*1:\s*{\s*'name'\s*:\s*'Jiho'\s*,\s*'vip_status'\s*:\s*False\s*,\s*'order'\s*:\s*'Orange Juice,\s*Apple Juice'\s*},\s*2:\s*{},\s*3:\s*{},\s*4:\s*{},\s*5:\s*{},\s*6:\s*{},\s*7:\s*{}\s*}/;  
    if (!tablesPattern.test(code)) {
        errors.push("Error: 'tables' dictionary is not correctly defined. Ensure Table 1 has name='Jiho', vip_status=False, and order='Orange Juice, Apple Juice', while Tables 2-7 are empty.");
    }

    // Check if assign_table function is correctly defined  
    const assignTablePattern = /def\s+assign_table\s*\(\s*table_number\s*,\s*name\s*,\s*vip_status=False\s*\)\s*:\s*\n\s*tables\[table_number\]\['name'\]\s*=\s*name\s*\n\s*tables\[table_number\]\['vip_status'\]\s*=\s*vip_status\s*\n\s*tables\[table_number\]\['order'\]\s*=\s*''/;  
    if (!assignTablePattern.test(code)) {
        errors.push("Error: 'assign_table' function is incorrect. Ensure it assigns 'name', 'vip_status', and initializes 'order' to an empty string.");
    }

    // Check if assign_and_print_order function is correctly defined with unpacking operator  
    const assignOrderPattern = /def\s+assign_and_print_order\s*\(\s*table_number\s*,\s*\*order_items\s*\)\s*:/;  
    if (!assignOrderPattern.test(code)) {
        errors.push("Error: 'assign_and_print_order' function must use the unpacking operator (*order_items).");
    }

    // Check if function assigns order items to the table  
    const assignOrderTablePattern = /tables\[table_number\]\['order'\]\s*=\s*order_items/;  
    if (!assignOrderTablePattern.test(code)) {
        errors.push("Error: The function does not assign order items correctly to 'tables[table_number]['order']'.");
    }

    // Check if function prints each order item  
    const printLoopPattern = /for\s+order_item\s+in\s+order_items\s*:\s*\n\s*print\(order_item\)/;  
    if (!printLoopPattern.test(code)) {
        errors.push("Error: The function does not iterate over 'order_items' and print each item.");
    }

    // Check if functions are called correctly  
    const assignTableCallPattern = /assign_table\s*\(\s*2\s*,\s*['"]Arwa['"]\s*,\s*True\s*\)/;  
    if (!assignTableCallPattern.test(code)) {
        errors.push("Error: 'assign_table' function is not called correctly with (2, 'Arwa', True).");
    }

    const assignOrderCallPattern = /assign_and_print_order\s*\(\s*2\s*,\s*['"]Steak['"]\s*,\s*['"]Seabass['"]\s*,\s*['"]Wine Bottle['"]\s*\)/;  
    if (!assignOrderCallPattern.test(code)) {
        errors.push("Error: 'assign_and_print_order' function is not called correctly with (2, 'Steak', 'Seabass', 'Wine Bottle').");
    }

    if (errors.length === 0) {  
        res.json({ success: true, message: "Correct! Your function correctly assigns and prints the order for a specific table." });  
    } else {  
        res.json({ success: false, message: errors });  
    }  
}

else if (exerciseId === "exercise23") {  
  let errors = [];

  // Ensure 'tables' dictionary is structured correctly  
  const tablesPattern = /tables\s*=\s*{\s*1:\s*{\s*'name'\s*:\s*'Chioma'\s*,\s*'vip_status'\s*:\s*False\s*,\s*'order'\s*:\s*{\s*'drinks'\s*:\s*'Orange Juice,\s*Apple Juice'\s*,\s*'food_items'\s*:\s*'Pancakes'\s*}\s*},\s*2:\s*{},\s*3:\s*{},\s*4:\s*{},\s*5:\s*{},\s*6:\s*{},\s*7:\s*{}\s*}/;  
  if (!tablesPattern.test(code)) {
      errors.push("Error: 'tables' dictionary is not correctly defined. Ensure Table 1 has name='Chioma', vip_status=False, and an 'order' dictionary with 'drinks' and 'food_items'. Tables 2-7 should be empty.");
  }

  // Check if assign_food_items function is correctly defined  
  const assignFoodItemsPattern = /def\s+assign_food_items\s*\(\s*\*\*order_items\s*\)\s*:/;  
  if (!assignFoodItemsPattern.test(code)) {
      errors.push("Error: 'assign_food_items' function must be defined with **kwargs (i.e., **order_items).");
  }

  // Check if function prints order_items  
  const printOrderItemsPattern = /print\s*\(\s*order_items\s*\)/;  
  if (!printOrderItemsPattern.test(code)) {
      errors.push("Error: 'assign_food_items' must print order_items.");
  }

  // Check if function extracts 'food' and 'drinks' using .get()  
  const foodDrinksPattern = /food\s*=\s*order_items\.get\(\s*['"]food['"]\s*\)\s*\n\s*drinks\s*=\s*order_items\.get\(\s*['"]drinks['"]\s*\)/;  
  if (!foodDrinksPattern.test(code)) {
      errors.push("Error: 'assign_food_items' must use .get() to extract 'food' and 'drinks' from order_items.");
  }

  // Check if function prints food and drinks  
  const printFoodDrinksPattern = /print\s*\(\s*food\s*\)\s*\n\s*print\s*\(\s*drinks\s*\)/;  
  if (!printFoodDrinksPattern.test(code)) {
      errors.push("Error: 'assign_food_items' must print both 'food' and 'drinks' variables.");
  }

  if (errors.length === 0) {  
      res.json({ success: true, message: "Correct! Your function correctly extracts and prints food and drinks from **kwargs." });  
  } else {  
      res.json({ success: false, message: errors });  
  }  
}

else if (exerciseId === "exercise24") {  
  let errors = [];

  // Ensure 'tables' dictionary is structured correctly  
  const tablesPattern = /tables\s*=\s*{\s*1:\s*{\s*'name'\s*:\s*'Chioma'\s*,\s*'vip_status'\s*:\s*False\s*,\s*'order'\s*:\s*{\s*'drinks'\s*:\s*'Orange Juice,\s*Apple Juice'\s*,\s*'food_items'\s*:\s*'Pancakes'\s*}\s*},\s*2:\s*{},\s*3:\s*{},\s*4:\s*{},\s*5:\s*{},\s*6:\s*{},\s*7:\s*{}\s*}/;  
  if (!tablesPattern.test(code)) {
      errors.push("Error: 'tables' dictionary is not correctly defined. Ensure Table 1 has name='Chioma', vip_status=False, and an 'order' dictionary with 'drinks' and 'food_items'. Tables 2-7 should be empty.");
  }

  // Check if assign_table function is correctly defined  
  const assignTablePattern = /def\s+assign_table\s*\(\s*table_number\s*,\s*name\s*,\s*vip_status\s*=\s*False\s*\)\s*:/;  
  if (!assignTablePattern.test(code)) {
      errors.push("Error: 'assign_table' function must be defined with parameters (table_number, name, vip_status=False).");
  }

  // Check if assign_table updates table 2 with 'Douglas' and vip_status=True  
  const assignTableDouglasPattern = /assign_table\s*\(\s*2\s*,\s*['"]Douglas['"]\s*,\s*True\s*\)/;  
  if (!assignTableDouglasPattern.test(code)) {
      errors.push("Error: 'assign_table' must be called with (2, 'Douglas', True).");
  }

  // Check if assign_food_items function is correctly defined  
  const assignFoodItemsPattern = /def\s+assign_food_items\s*\(\s*table_number\s*,\s*\*\*order_items\s*\)\s*:/;  
  if (!assignFoodItemsPattern.test(code)) {
      errors.push("Error: 'assign_food_items' function must be defined with **kwargs (i.e., **order_items).");
  }

  // Check if function extracts 'food' and 'drinks' using .get()  
  const foodDrinksPattern = /food\s*=\s*order_items\.get\(\s*['"]food['"]\s*\)\s*\n\s*drinks\s*=\s*order_items\.get\(\s*['"]drinks['"]\s*\)/;  
  if (!foodDrinksPattern.test(code)) {
      errors.push("Error: 'assign_food_items' must use .get() to extract 'food' and 'drinks' from order_items.");
  }

  // Check if function assigns correct values for table 2  
  const assignFoodItemsValuesPattern = /assign_food_items\s*\(\s*2\s*,\s*food\s*=\s*['"]Seabass,\s*Gnocchi,\s*Pizza['"]\s*,\s*drinks\s*=\s*['"]Margarita,\s*Water['"]\s*\)/;  
  if (!assignFoodItemsValuesPattern.test(code)) {
      errors.push("Error: 'assign_food_items' must be called with (2, food='Seabass, Gnocchi, Pizza', drinks='Margarita, Water').");
  }

  // Check if print statements exist to show correct updates  
  const printStatementsPattern = /print\s*\(\s*['"]--- tables with Douglas ---['"]\s*,\s*tables\s*\)/;  
  if (!printStatementsPattern.test(code)) {
      errors.push("Error: You must print '--- tables with Douglas ---' followed by the tables dictionary.");
  }

  const printUpdatedTablesPattern = /print\s*\(\s*['"]\\n --- tables after update --- \\n['"]\s*\)/;  
  if (!printUpdatedTablesPattern.test(code)) {
      errors.push("Error: You must print '\\n --- tables after update --- \\n' before displaying updated tables.");
  }

  if (errors.length === 0) {  
      res.json({ success: true, message: "Correct! Your solution properly defines and updates the tables dictionary." });  
  } else {  
      res.json({ success: false, message: errors });  
  }  
}

else if (exerciseId === "exercise25") {  
  let errors = [];

  // Check if function 'single_prix_fixe_order' is defined correctly  
  const functionPattern = /def\s+single_prix_fixe_order\s*\(\s*appetizer\s*,\s*\*entrees\s*,\s*sides\s*,\s*\*\*dessert_scoops\s*\)\s*:/;  
  if (!functionPattern.test(code)) {
      errors.push("Error: 'single_prix_fixe_order' must have parameters: 'appetizer', '*entrees', 'sides', and '**dessert_scoops'.");
  }

  // Check if function correctly prints values  
  const printPattern = /print\s*\(\s*appetizer\s*\)\s*\n\s*print\s*\(\s*entrees\s*\)\s*\n\s*print\s*\(\s*sides\s*\)\s*\n\s*print\s*\(\s*dessert_scoops\s*\)/;  
  if (!printPattern.test(code)) {
      errors.push("Error: 'single_prix_fixe_order' must print 'appetizer', 'entrees', 'sides', and 'dessert_scoops'.");
  }

  // Ensure function is called with correct arguments  
  const functionCallPattern = /single_prix_fixe_order\s*\(\s*['"]Baby Beets['"]\s*,\s*['"]Salmon['"]\s*,\s*['"]Scallops['"]\s*,\s*sides\s*=\s*['"]Mashed Potatoes['"]\s*,\s*ice_cream_scoop1\s*=\s*['"]Vanilla['"]\s*,\s*ice_cream_scoop2\s*=\s*['"]Cookies and Cream['"]\s*\)/;  
  if (!functionCallPattern.test(code)) {
      errors.push("Error: 'single_prix_fixe_order' must be called with ('Baby Beets', 'Salmon', 'Scallops', sides='Mashed Potatoes', ice_cream_scoop1='Vanilla', ice_cream_scoop2='Cookies and Cream').");
  }

  if (errors.length === 0) {  
      res.json({ success: true, message: "Correct! Your solution follows the expected structure and logic." });  
  } else {  
      res.json({ success: false, message: errors });  
  }  
}

  
else if (exerciseId === "exercise31") {  
  let errors = [];  

  // Check if namedtuple is defined correctly  
  const namedTuplePattern =  
      /country\s*=\s*namedtuple\s*\(\s*["']country["']\s*,\s*\[\s*["']name["']\s*,\s*["']capital["']\s*,\s*["']continent["']\s*\]\s*\)/;  
  if (!namedTuplePattern.test(code)) {  
      errors.push("Error: Ensure that 'country' is defined as a namedtuple with fields 'name', 'capital', and 'continent'.");  
  }  

  // Check if France is defined correctly  
  const francePattern =  
      /France\s*=\s*country\s*\(\s*["']France["']\s*,\s*["']Paris["']\s*,\s*["']europe["']\s*\)/i;  
  if (!francePattern.test(code)) {  
      errors.push("Error: The 'France' tuple should be initialized as 'France = country(\"France\", \"Paris\", \"Europe\")'.");  
  }  

  // Check if Japan is defined correctly  
  const japanPattern =  
      /japan\s*=\s*country\s*\(\s*["']Japan["']\s*,\s*["']Tokyo["']\s*,\s*["']Asia["']\s*\)/i;  
  if (!japanPattern.test(code)) {  
      errors.push("Error: The 'Japan' tuple should be initialized as 'Japan = country(\"Japan\", \"Tokyo\", \"Asia\")'.");  
  }  

  // Check if Senegal is defined correctly  
  const senegalPattern =  
      /senegal\s*=\s*country\s*\(\s*["']Senegal["']\s*,\s*["']Dakar["']\s*,\s*["']africa["']\s*\)/i;  
  if (!senegalPattern.test(code)) {  
      errors.push("Error: The 'Senegal' tuple should be initialized as 'Senegal = country(\"Senegal\", \"Dakar\", \"Africa\")'.");  
  }  

  // Check if the countries tuple is defined correctly  
  const countriesTuplePattern =  
      /countries\s*=\s*\(\s*japan\s*,\s*France\s*,\s*senegal\s*\)/i;  
  if (!countriesTuplePattern.test(code)) {  
      errors.push("Error: The 'countries' tuple must contain 'Japan', 'France', and 'Senegal' in the correct order.");  
  }  

  // Return success or error messages  
  if (errors.length === 0) {  
      res.json({ success: true, message: "Correct! You may proceed." });  
  } else {  
      res.json({ success: false, message: errors });  
  }  
}  

else if (exerciseId === "exercise32") {  
  let errors = [];  

  // Check if the function `odd_or_even` is correctly defined  
  const oddOrEvenPattern =  
      /def\s+odd_or_even\s*\(\s*n\s*,\s*even_function\s*,\s*odd_function\s*\)\s*:\s*\n\s*if\s+n\s*%\s*2\s*==\s*0\s*:\s*\n\s*return\s+even_function\s*\(\s*n\s*\)\s*\n\s*else\s*:\s*\n\s*return\s+odd_function\s*\(\s*n\s*\)/;  
  if (!oddOrEvenPattern.test(code)) {  
      errors.push("Error: Ensure 'odd_or_even' is correctly implemented with three parameters and returns the correct function.");  
  }  

  // Check if `square` is correctly assigned using a lambda function  
  const squarePattern = /square\s*=\s*lambda\s*x\s*:\s*x\s*\*\s*x/;  
  if (!squarePattern.test(code)) {  
      errors.push("Error: 'square' must be defined as a lambda function: 'square = lambda x: x * x'.");  
  }  

  // Check if `cube` is correctly assigned using a lambda function  
  const cubePattern = /cube\s*=\s*lambda\s*x\s*:\s*x\s*\*\s*x\s*\*\s*x/;  
  if (!cubePattern.test(code)) {  
      errors.push("Error: 'cube' must be defined as a lambda function: 'cube = lambda x: x * x * x'.");  
  }  

  // Check if `test` is correctly assigned  
  const testPattern = /test\s*=\s*odd_or_even\s*\(\s*5\s*,\s*cube\s*,\s*square\s*\)/;  
  if (!testPattern.test(code)) {  
      errors.push("Error: 'test' must call 'odd_or_even' correctly with arguments (5, cube, square).");  
  }  

  // Return success or error messages  
  if (errors.length === 0) {  
      res.json({ success: true, message: "Correct! You may proceed." });  
  } else {  
      res.json({ success: false, message: errors });  
  }  
}  


else if (exerciseId === "exercise33") {  
    let errors = [];  

    // Check if filter() is correctly implemented to remove odd numbers  
    const filterPattern = /filtered_numbers\s*=\s*filter\s*\(\s*lambda\s+x:\s*x\s*%\s*2\s*==\s*0\s*,\s*nums\s*\)/;  
    if (!filterPattern.test(code)) {  
        errors.push("Error: Ensure 'filtered_numbers' uses filter() to keep only even numbers from 'nums'.");  
    }  

    // Check if filter result is printed correctly  
    const printFilterPattern = /print\s*\(\s*tuple\s*\(\s*filtered_numbers\s*\)\s*\)/;  
    if (!printFilterPattern.test(code)) {  
        errors.push("Error: Ensure you print 'filtered_numbers' as a tuple.");  
    }  

    // Check if map() is correctly implemented to multiply all elements by 3  
    const mapPattern = /mapped_numbers\s*=\s*map\s*\(\s*lambda\s+x:\s*x\s*\*\s*3\s*,\s*nums\s*\)/;  
    if (!mapPattern.test(code)) {  
        errors.push("Error: Ensure 'mapped_numbers' uses map() to multiply each element by 3.");  
    }  

    // Check if map result is printed correctly  
    const printMapPattern = /print\s*\(\s*tuple\s*\(\s*mapped_numbers\s*\)\s*\)/;  
    if (!printMapPattern.test(code)) {  
        errors.push("Error: Ensure you print 'mapped_numbers' as a tuple.");  
    }  

    // Check if reduce() is correctly implemented to sum all elements  
    const reducePattern = /sum\s*=\s*reduce\s*\(\s*lambda\s+x,\s*y:\s*x\s*\+\s*y\s*,\s*nums\s*\)/;  
    if (!reducePattern.test(code)) {  
        errors.push("Error: Ensure 'sum' uses reduce() to sum all elements in 'nums'.");  
    }  

    // Check if reduce result is printed correctly  
    const printReducePattern = /print\s*\(\s*sum\s*\)/;  
    if (!printReducePattern.test(code)) {  
        errors.push("Error: Ensure you print 'sum' correctly.");  
    }  

    // Return success or error messages  
    if (errors.length === 0) {  
        res.json({ success: true, message: "Correct! You may proceed." });  
    } else {  
        res.json({ success: false, message: errors });  
    }  
}  


else if (exerciseId === "exercise34") {  
    let errors = [];  

    // Check if map() correctly doubles values greater than 10  
    const mapFilterPattern = /greater_than_10_doubled\s*=\s*map\s*\(\s*lambda\s+x:\s*x\s*\*\s*2\s*,\s*filter\s*\(\s*lambda\s+y:\s*y\s*>\s*10\s*,\s*nums\s*\)\s*\)/;  
    if (!mapFilterPattern.test(code)) {  
        errors.push("Error: Ensure 'greater_than_10_doubled' correctly filters values > 10 and doubles them using map().");  
    }  

    // Check if the result of map() is printed correctly  
    const printMapFilterPattern = /print\s*\(\s*tuple\s*\(\s*greater_than_10_doubled\s*\)\s*\)/;  
    if (!printMapFilterPattern.test(code)) {  
        errors.push("Error: Ensure you print 'greater_than_10_doubled' as a tuple.");  
    }  

    // Check if filter() correctly filters values divisible by 3 and map() multiplies them by 3  
    const functionalWayPattern = /functional_way\s*=\s*map\s*\(\s*lambda\s+x:\s*x\s*\*\s*3\s*,\s*filter\s*\(\s*lambda\s+y:\s*y\s*%\s*3\s*==\s*0\s*,\s*nums\s*\)\s*\)/;  
    if (!functionalWayPattern.test(code)) {  
        errors.push("Error: Ensure 'functional_way' correctly filters values divisible by 3 and multiplies them by 3 using map().");  
    }  

    // Check if the result of the functional approach is printed correctly  
    const printFunctionalWayPattern = /print\s*\(\s*tuple\s*\(\s*functional_way\s*\)\s*\)/;  
    if (!printFunctionalWayPattern.test(code)) {  
        errors.push("Error: Ensure you print 'functional_way' as a tuple.");  
    }  

    // Return success or error messages  
    if (errors.length === 0) {  
        res.json({ success: true, message: "Correct! You may proceed." });  
    } else {  
        res.json({ success: false, message: errors });  
    }  
}  

else if (exerciseId === "exercise35") {  
    let errors = [];  

    // Check if reduce() and map() are used correctly to sum all fruit sales  
    const totalFruitsPattern = /total_fruits\s*=\s*reduce\s*\(\s*lambda\s+x,\s*y:\s*x\s*\+\s*y\s*,\s*map\s*\(\s*lambda\s+q:\s*fruits\[\s*q\s*\]\[0\]\s*\+\s*fruits\[\s*q\s*\]\[1\]\s*\+\s*fruits\[\s*q\s*\]\[2\]\s*,\s*fruits\s*\)\s*\)/;  
    if (!totalFruitsPattern.test(code)) {  
        errors.push("Error: Ensure 'total_fruits' correctly applies map() to sum each fruit's sales and reduce() to compute the final total.");  
    }  

    // Check if total_fruits is printed correctly  
    const printTotalFruitsPattern = /print\s*\(\s*total_fruits\s*\)/;  
    if (!printTotalFruitsPattern.test(code)) {  
        errors.push("Error: Ensure you print 'total_fruits' correctly.");  
    }  

    // Return success or error messages  
    if (errors.length === 0) {  
        res.json({ success: true, message: "Correct! You may proceed." });  
    } else {  
        res.json({ success: false, message: errors });  
    }  
}  

else if (exerciseId === "exercise36") {  
    let errors = [];  

    // Check if reduce(), map(), and filter() are used correctly to calculate the total cost  
    const totalPattern = /total\s*=\s*reduce\s*\(\s*lambda\s+x,\s*y:\s*x\s*\+\s*y\s*,\s*filter\s*\(\s*lambda\s+r:\s*r\s*>\s*150\.00\s*,\s*map\s*\(\s*lambda\s+q:\s*costs\[\s*q\s*\]\[0\]\s*\*\s*costs\[\s*q\s*\]\[1\]\s*,\s*costs\s*\)\s*\)\s*\)/;  
    if (!totalPattern.test(code)) {  
        errors.push("Error: Ensure 'total' correctly applies map() to compute cost, filter() to remove items below 150, and reduce() to sum them.");  
    }  

    // Check if total is printed correctly  
    const printTotalPattern = /print\s*\(\s*total\s*\)/;  
    if (!printTotalPattern.test(code)) {  
        errors.push("Error: Ensure you print 'total' correctly.");  
    }  

    // Check if reduce(), map(), and filter() are used correctly to calculate the product  
    const productPattern = /product\s*=\s*reduce\s*\(\s*lambda\s+x,\s*y:\s*x\s*\*\s*y\s*,\s*map\s*\(\s*lambda\s+z:\s*z\s*\+\s*5\s*,\s*filter\s*\(\s*lambda\s+q:\s*q\s*<\s*10\s*,\s*nums\s*\)\s*\)\s*\)/;  
    if (!productPattern.test(code)) {  
        errors.push("Error: Ensure 'product' correctly applies filter() for values below 10, map() to add 5, and reduce() to multiply.");  
    }  

    // Check if product is printed correctly  
    const printProductPattern = /print\s*\(\s*product\s*\)/;  
    if (!printProductPattern.test(code)) {  
        errors.push("Error: Ensure you print 'product' correctly.");  
    }  

    // Return success or error messages  
    if (errors.length === 0) {  
        res.json({ success: true, message: "Correct! You may proceed." });  
    } else {  
        res.json({ success: false, message: errors });  
    }  
}  
 else {
      // Standard check for other exercises
      if (output === correctSolutions[exerciseId]) {
        res.json({ success: true, message: "Correct! You may proceed." });
      } else {
        res.json({ success: false, message: `Incorrect! Expected output: "${correctSolutions[exerciseId]}"` });
      }
    }
  });
});


