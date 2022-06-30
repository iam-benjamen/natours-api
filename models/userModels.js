const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please, provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //this only works on SAVE() AND CREATE()
      validator: function (el) {
        return el === this.password;
      },
      message: "Confirmed password must be the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  //only run if  password was modified
  if (!this.isModified("password")) return next();

  //hash password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
