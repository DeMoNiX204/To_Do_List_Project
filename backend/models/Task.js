const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String }, // ฟิลด์วันที่สำหรับเช็กเลยกำหนด
    status: { type: String, default: 'To-Do' },
    category: { type: String, default: 'General' },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);