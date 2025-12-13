const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB Connected and all set to work ');
  } catch (err) {
    console.log('MongoDB Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
