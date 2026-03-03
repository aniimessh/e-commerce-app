const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (email) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(email);
        },
        message: "Enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["isUser", "isAdmin"],
      required: true,
      default: "isUser",
    },
    profilePicture: {
      type: String,
    },
    cartItems: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function () {
  if (!this.isModified("username")) {
    return;
  }

  try {
    this.username =
      this.username.charAt(0).toUpperCase() + this.username.slice(1);
  } catch (error) {
    console.log("Error saving username");
    console.log(error.message);
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    // generate salt
    const salt = await bcrypt.genSalt(10);

    // hash password
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log("Error hashing password");
    console.log(error.message);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.log("Error in comparing password");
    console.log(error.message);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
