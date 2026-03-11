const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // รับ Token จาก Header ที่ React ส่งมา
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'ปฏิเสธการเข้าถึง: ไม่มี Token' });

    try {
        // ถอดรหัส Token ด้วยกุญแจลับของเรา
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified; // เก็บข้อมูล User (ที่มี _id) ไว้ใช้ต่อ
        next(); // ให้ผ่านด่านไปทำงานต่อได้
    } catch (err) {
        res.status(400).json({ message: 'Token ไม่ถูกต้อง หรือหมดอายุ' });
    }
};

module.exports = verifyToken;