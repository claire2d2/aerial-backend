const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      // TODO : upload default image onto cloudinary
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
    },
    roles: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    darkModePref: {
      type: String,
      enum: ["system", "light", "dark"],
      default: "system",
    },
    filterHistPref: {
      type: Boolean,
      default: false,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
