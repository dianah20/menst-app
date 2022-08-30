// Import mongoose
const mongoose = require("mongoose");

// Create donor model
const GetDoctorModel = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      max: 30,
      min: 4,
    },
    location: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    qbody: {
        type: String,
        max: 1000,
        required: true
    },
    tel: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Export this model for import in the routes that will need to use it
module.exports = mongoose.model("GetDoctor", GetDoctorModel);
