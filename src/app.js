require("dotenv").config({
  quiet: true,
});
const express = require("express");
const connectToDB = require("./config/db");
const authRoutes = require("./modules/auth/auth.routes");
const cookieParser = require("cookie-parser");

// variables
const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(cookieParser());

// connect to database
connectToDB();

// routes
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
