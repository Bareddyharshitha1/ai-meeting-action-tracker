const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const meetingRoutes = require("./routes/meetingRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/meetings", meetingRoutes);
app.use("/api/auth", authRoutes);


// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });


// Test route
app.get("/", (req, res) => {
    res.send(
        "AI Meeting Action Tracker Backend is running!"
    );
});


// Start server
app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});