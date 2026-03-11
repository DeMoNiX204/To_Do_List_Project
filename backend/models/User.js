const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // 👈 เพิ่มบรรทัดนี้เข้ามา (บังคับใส่และห้ามซ้ำ)
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);