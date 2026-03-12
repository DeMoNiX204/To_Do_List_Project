import { useState } from 'react';

const CATEGORIES = ['ทั่วไป', 'เรียน', 'ทำงาน', 'ส่วนตัว'];
const CAT_ICONS = { 'ทั่วไป': '📁', 'เรียน': '📚', 'ทำงาน': '💻', 'ส่วนตัว': '🏠' };

// Map สถานะภาษาอังกฤษเป็นภาษาไทยสำหรับแสดงผลปุ่ม
const STATUS_MAP = {
    'To-Do': 'รอดำเนินการ',
    'In Progress': 'กำลังทำ',
    'Done': 'เสร็จสิ้น'
    };

    export default function TaskDetailModal({ task, onClose, onUpdateTask, onDelete }) {
    // 1. สร้าง State สำหรับเก็บค่าต่างๆ
    const [title, setTitle] = useState(task.title || '');
    const [category, setCategory] = useState(task.category || 'ทั่วไป');
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [description, setDescription] = useState(task.description || '');
    const [status, setStatus] = useState(task.status || 'To-Do');

    // 2. ฟังก์ชันบันทึก
    const handleSave = () => {
        onUpdateTask(task.id, { title, category, dueDate, description, status });
        onClose();
    };

    // 3. ปรับสถานะที่มีให้เลือก (ลบ 'เลยกำหนด' ออกจากตัวเลือกที่กดได้)
    const selectableStatuses = ['To-Do', 'In Progress', 'Done'];

    return (
        <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '16px'
        }}>
        <div style={{
            background: 'var(--surface)', padding: '24px', borderRadius: 'var(--r-lg)',
            width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)'
        }}>
            {/* ══ HEADER ══ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text2)' }}>รายละเอียดงาน</span>
                {/* ป้ายเตือนสถานะปัจจุบัน */}
                {task.status === 'เลยกำหนด' && (
                <span style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600' }}>
                    ⚠️ เลยกำหนด
                </span>
                )}
            </div>
            <button onClick={onClose} style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: '50%',
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text2)'
            }}>✕</button>
            </div>

            {/* ══ TITLE ══ */}
            <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
                width: '100%', fontSize: '24px', fontWeight: '600', border: 'none',
                outline: 'none', marginBottom: '20px', color: 'var(--text)', background: 'transparent'
            }}
            placeholder="ชื่องาน..."
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {/* ══ CATEGORY ══ */}
            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--r-sm)' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', fontWeight: '600' }}>หมวดหมู่</label>
                <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '15px', background: 'transparent', cursor: 'pointer', color: 'var(--text)' }}
                >
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
                </select>
            </div>

            {/* ══ DUE DATE (จุดแก้ที่ 3: รีเซ็ตสถานะเมื่อเลื่อนวัน) ══ */}
            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--r-sm)' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', fontWeight: '600' }}>วันที่ต้องเสร็จ</label>
                <input
                type="date"
                value={dueDate}
                onChange={e => {
                    setDueDate(e.target.value);
                    // 🌟 ดักเช็ก: ถ้าแก้โดนวันที่ และสถานะเดิมคือเลยกำหนด ให้กลับเป็นรอดำเนินการ
                    if (status === 'เลยกำหนด') {
                    setStatus('To-Do');
                    }
                }}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}
                />
            </div>
            </div>

            {/* ══ DESCRIPTION ══ */}
            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--r-sm)', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', fontWeight: '600' }}>รายละเอียด</label>
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', minHeight: '80px', resize: 'vertical', background: 'transparent', color: 'var(--text)' }}
                placeholder="เพิ่มรายละเอียดงาน..."
            />
            </div>

            {/* ══ STATUS BALLOONS (จุดแก้ที่ 1 และ 2: ลบเลยกำหนด และล็อกปุ่ม) ══ */}
            <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '12px', fontWeight: '600' }}>อัปเดตสถานะ</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectableStatuses.map(s => (
                <button
                    key={s}
                    onClick={() => setStatus(s)}
                    disabled={status === 'เลยกำหนด'} // 🌟 ล็อกปุ่มถ้าสถานะเป็นเลยกำหนด
                    style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--r-sm)', fontSize: '13px', fontWeight: '500',
                    border: `1px solid ${status === s ? 'var(--accent)' : 'var(--border)'}`,
                    background: status === s ? 'var(--accent-light)' : 'transparent',
                    color: status === s ? 'var(--accent)' : 'var(--text2)',
                    cursor: status === 'เลยกำหนด' ? 'not-allowed' : 'pointer',
                    opacity: status === 'เลยกำหนด' && status !== s ? 0.5 : 1 // ทำสีจางถ้าโดนล็อก
                    }}
                >
                    {STATUS_MAP[s]}
                </button>
                ))}
                
                {/* โชว์ป้าย "เลยกำหนด" สีแดง (กดไม่ได้) เฉพาะตอนที่งานติดสถานะนี้อยู่ */}
                {status === 'เลยกำหนด' && (
                <div style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--r-sm)', fontSize: '13px', fontWeight: '500',
                    border: '1px solid var(--danger)', background: 'var(--danger-bg)', color: 'var(--danger)',
                    textAlign: 'center', cursor: 'not-allowed'
                }}>
                    เลยกำหนด
                </div>
                )}
            </div>
            
            {/* 🌟 ข้อความแนะนำวิธีปลดล็อก */}
            {status === 'เลยกำหนด' && (
                <p style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '8px' }}>
                * งานนี้เลยกำหนดแล้ว กรุณาเลื่อน "วันที่ต้องเสร็จ" เป็นวันอื่นเพื่อปลดล็อกสถานะ
                </p>
            )}
            </div>

            {/* ══ FOOTER BUTTONS ══ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
                onClick={() => onDelete(task.id)}
                style={{
                padding: '10px 16px', background: 'var(--danger-bg)', color: 'var(--danger)',
                border: '1px solid #fca5a5', borderRadius: 'var(--r-sm)', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
            >
                🗑️ ลบงานนี้
            </button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                onClick={onClose}
                style={{
                    padding: '10px 16px', background: 'transparent', color: 'var(--text2)',
                    border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
                >
                ปิด
                </button>
                <button
                onClick={handleSave}
                style={{
                    padding: '10px 20px', background: 'var(--accent)', color: '#fff',
                    border: 'none', borderRadius: 'var(--r-sm)', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}
                >
                💾 บันทึก
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}