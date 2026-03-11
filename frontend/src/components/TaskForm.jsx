import { useState } from 'react';

function TaskForm({ onAddTask }) {
  // สร้าง State ย่อยไว้เก็บข้อความที่ผู้ใช้กำลังพิมพ์
    const [title, setTitle] = useState('');

    // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่ม "เพิ่มงาน" (หรือกด Enter)
    const handleSubmit = (e) => {
        e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชตอนกด Submit
        
        if (!title.trim()) return; // ถ้าพิมพ์แต่ช่องว่าง หรือไม่พิมพ์อะไรเลย ให้ข้ามไป

        // ส่งข้อมูลกลับไปให้ App.jsx จัดการต่อ
        onAddTask(title);

        // ล้างช่องกรอกข้อมูลให้ว่างเพื่อเตรียมพิมพ์งานถัดไป
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
        <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เพิ่มงานใหม่ที่ต้องทำ..." 
            style={{ 
            flex: 1, 
            padding: '12px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ced4da',
            fontSize: '16px',
            outline: 'none'
            }}
        />
        <button 
            type="submit" 
            style={{ 
            padding: '12px 24px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
            + เพิ่มงาน
        </button>
        </form>
    );
}

export default TaskForm;