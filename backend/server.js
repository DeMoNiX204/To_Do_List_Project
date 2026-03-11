const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully!'))
    .catch((err) => console.log('❌ Failed to connect to MongoDB:', err));

// --- เรียกใช้ API Routes ---
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth'); // เพิ่มตรงนี้

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes); // เพิ่มตรงนี้ เพื่อให้ใช้งาน /api/auth/login ได้

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});