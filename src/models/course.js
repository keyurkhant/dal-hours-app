const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
    },
    maxHours: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["TA", "MARKER"],
      default: "TA",
      required: true,
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  CRN: {
    type: String,
    required: true,
  },
  // TERM Format: SUMMER_2023
  term: {
    type: String,
    required: true,
  },
  startDate: {
    type: Number,
    required: false,
  },
  endDate: {
    type: Number,
    required: false,
  },
  instructorId: {
    type: String,
    required: true,
  },
  members: [memberSchema],
});

const Course = mongoose.model("Courses", courseSchema);

module.exports = Course;
