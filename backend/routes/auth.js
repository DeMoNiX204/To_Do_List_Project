const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// API สมัครสมาชิก
    router.post('/register', async (req, res) => {
    try {
        // 👈 รับ email มาจากหน้าเว็บตรงนี้
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
        return res.status(400).json({ message: 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
        username,
        email, // 👈 บันทึก email ลงฐานข้อมูล
        password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ! สามารถเข้าสู่ระบบได้เลย' });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // API เข้าสู่ระบบ
    router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
        token,
        user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

module.exports = router;