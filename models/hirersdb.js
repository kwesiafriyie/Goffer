import mongoose from "mongoose";
// import mongoose from "mongoose";

const HirerSchema = mongoose.Schema({
  fname: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exists in database"],

    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },

  phone: {
    type: Number,
    required: false,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

const HirerModel =
  mongoose.model.Hirers || mongoose.model("Hirers", HirerSchema);
export default HirerModel;
