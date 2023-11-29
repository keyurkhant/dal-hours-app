const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
};

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const collectionName = "CSCI-5193";

const uri = `mongodb+srv://root:Dalhousie%40123@cluster0.sdzkpyc.mongodb.net/CSCI-5193`;  

async function connect() {
  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Unable to connect to MongoDB", err);
  }
}

module.exports = {
  connect,
};
