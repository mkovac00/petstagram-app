const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  animals: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Animal" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
