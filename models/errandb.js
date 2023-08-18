import mongoose from "mongoose";

const errandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  hirer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hirers",
    required: true,
  },

  gofer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gofers",
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending",
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

const ErrandModel = mongoose.model("Errands", errandSchema);
export default ErrandModel;
