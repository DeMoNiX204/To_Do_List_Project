const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyToken = require('../middleware/auth'); // นำเข้ายามรักษาความปลอดภัย

// 1. ดึงงานทั้งหมด (ดึงเฉพาะงานของ User คนนี้)
router.get('/', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // 2. เพิ่มงานใหม่ (ผูกงานเข้ากับ userId)
    router.post('/', verifyToken, async (req, res) => {
    const newTask = new Task({
        ...req.body,
        userId: req.user.id // เอา ID ของคนที่ Login มาแปะใส่งานนี้!
    });
    
    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    });

    // 3. ลบงาน (เช็กให้ชัวร์ว่าเป็นงานของตัวเองจริงๆ ค่อยลบ)
    router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ message: 'ไม่พบงาน หรือคุณไม่มีสิทธิ์ลบงานนี้' });
        res.json({ message: 'ลบงานเรียบร้อย' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;