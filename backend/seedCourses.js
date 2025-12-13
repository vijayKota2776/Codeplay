// backend/seedCourses.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Course = require("./models/Course");

const run = async () => {
  await connectDB();

  // Clear existing courses
  await Course.deleteMany({});

  const courses = [
    {
      title: "React Basics",
      type: "docs",
      difficulty: "beginner",
      tags: ["jsx", "components"],
      sections: [
        {
          title: "Components",
          order: 1,
          topics: [
            {
              title: "Components and Props",
              content: "Intro to components and props...",
              exerciseId: "react-basics-1",
              testCases: [],
            },
            {
              title: "State and Events",
              content: "Using useState and handling events...",
              exerciseId: "react-basics-2",
              testCases: [],
            },
          ],
        },
      ],
    },
    {
      title: "React State Management",
      type: "docs",
      difficulty: "intermediate",
      tags: ["state", "context"],
      sections: [
        {
          title: "State",
          order: 1,
          topics: [
            {
              title: "useState patterns",
              content: "Managing local state with useState...",
              exerciseId: "state-1",
              testCases: [],
            },
            {
              title: "Derived state",
              content: "Avoiding unnecessary derived state...",
              exerciseId: "state-2",
              testCases: [],
            },
          ],
        },
      ],
    },
  ];

  await Course.insertMany(courses);
  console.log("Seeded courses.");
  mongoose.connection.close();
};

run().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
