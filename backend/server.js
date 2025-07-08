const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express(); // ✅ app must be initialized before using it

const taskRoutes = require('./routes/tasks'); // require after app initialized

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes); // ✅ use app after initialization

MONGO_URL="mongodb+srv://sagarrwt845:kta6RDx3v9A4yC8t@cluster0.knoizr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

