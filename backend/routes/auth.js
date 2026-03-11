const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. API สมัครสมาชิก (Register)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // เช็กว่ามีชื่อผู้ใช้นี้ในระบบหรือยัง
        const existingUser = await User.findOne({ username });
        if (existingUser) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });
        }

        // เข้ารหัสผ่าน (Hash Password) เพื่อความปลอดภัยก่อนบันทึกลง Database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // สร้าง User ใหม่
        const newUser = new User({
        username,
        password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ! สามารถเข้าสู่ระบบได้เลย' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // 2. API เข้าสู่ระบบ (Login)
    router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ค้นหา User ใน Database
        const user = await User.findOne({ username });
        if (!user) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        // ตรวจสอบรหัสผ่านว่าตรงกันไหม
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        // สร้างบัตรผ่าน JWT Token (มีอายุ 1 วัน)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // ส่ง Token และข้อมูล User กลับไปให้ Frontend
        res.json({
        token,
        user: { id: user._id, username: user.username }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;