require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const checkCourses = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/codeplay';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses.`);
        courses.forEach(c => console.log(`- ${c.title} (${c.level})`));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkCourses();
