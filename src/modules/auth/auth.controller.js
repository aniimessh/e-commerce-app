const User = require("./auth.model");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required details",
      });
    }

    // check for exisiting user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }

    // create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role,
      profilePicture: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}`,
    });

    const data = {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      profilePicture: newUser.profilePicture,
    };

    return res.status(201).json({
      success: true,
      message: "User created successfully. Please login to verify",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      method: signupUser.name,
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required details",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or passwordd",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const data = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Login Succesfull",
      data,
    });
  } catch (error) {
    console.error(`[loginUser] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
