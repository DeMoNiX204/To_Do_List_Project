const express = require('express');
const router = express.Router();
// 🌟 จุดสำคัญ: ดึง Model เข้ามาให้ถูกต้อง ห้ามดึงไฟล์ตัวเอง
const Task = require('../models/Task');
const verifyToken = require('../middleware/auth');

// 1. ดึงงานทั้งหมด (พร้อมระบบเปลี่ยนสถานะ "เลยกำหนด" อัตโนมัติ)
router.get('/', verifyToken, async (req, res) => {
    try {
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const todayStr = (new Date(today - offset)).toISOString().split('T')[0];

        // อัปเดตงานที่เลยกำหนดอัตโนมัติ
        await Task.updateMany(
        { 
            userId: req.user.id, 
            status: { $nin: ['Done', 'เลยกำหนด'] }, 
            dueDate: { $lt: todayStr, $exists: true, $ne: '' } 
        },
        { $set: { status: 'เลยกำหนด' } }
        );

        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. เพิ่มงานใหม่
router.post('/', verifyToken, async (req, res) => {
    try {
        const newTask = new Task({ 
        ...req.body, 
        userId: req.user.id 
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. แก้ไข/อัปเดตงาน (PUT)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id }, 
        req.body, 
        { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'ไม่พบงาน' });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. ลบงาน
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ message: 'ไม่พบงาน' });
        res.json({ message: 'ลบงานเรียบร้อย' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;