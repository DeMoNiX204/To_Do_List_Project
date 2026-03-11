const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // เพิ่มบรรทัดนี้เข้ามา!
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'To-Do' },
    category: { type: String, default: 'General' },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);