import { useState } from 'react';

export default function TaskForm({ onAddTask, onClose }) {
    const [title, setTitle]       = useState('');
    const [category, setCategory] = useState('ทั่วไป');
    const [description, setDesc]  = useState('');
    const [dueDate, setDueDate]   = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        if (!title.trim()) { alert('กรุณาระบุชื่องานด้วยครับ!'); return; }
        onAddTask({ title, category, description, dueDate });
    };

    return (
        <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,23,20,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
        }} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{
            background: 'var(--surface)', borderRadius: 'var(--r-lg)',
            padding: '32px', width: '100%', maxWidth: '500px',
            boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
            animation: 'popIn 0.15s ease',
        }}>
            <style>{`@keyframes popIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }`}</style>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: '500', color: 'var(--text)', margin: 0 }}>
                ✨ เพิ่มงานใหม่
            </h2>
            <button onClick={onClose} style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text2)',
                fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Field label="ชื่องาน *">
                <input type="text" placeholder="พิมพ์ชื่องานที่นี่..." value={title} autoFocus
                onChange={e => setTitle(e.target.value)} required style={inp} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="หมวดหมู่">
                <select value={category} onChange={e => setCategory(e.target.value)} style={inp}>
                    <option value="ทั่วไป">📁 ทั่วไป</option>
                    <option value="เรียน">📚 เรียน</option>
                    <option value="ทำงาน">💻 ทำงาน</option>
                    <option value="ส่วนตัว">🏠 ส่วนตัว</option>
                </select>
                </Field>
                <Field label="วันที่ต้องเสร็จ">
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inp} />
                </Field>
            </div>

            <Field label="รายละเอียดเพิ่มเติม">
                <textarea value={description} onChange={e => setDesc(e.target.value)}
                placeholder="ระบุรายละเอียดของงาน..." rows="3"
                style={{ ...inp, resize: 'vertical', minHeight: '88px' }} />
            </Field>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button type="button" onClick={onClose} style={{
                padding: '10px 20px', background: 'var(--bg2)',
                border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)',
                color: 'var(--text2)', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                }}>ยกเลิก</button>
                <button type="submit" style={{
                padding: '10px 24px', background: 'var(--accent)', border: 'none',
                borderRadius: 'var(--r-sm)', color: '#fff', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(26,71,49,0.25)',
                }}>บันทึกงาน →</button>
            </div>
            </form>
        </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
        <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', fontWeight: '600', marginBottom: '7px' }}>{label}</label>
        {children}
        </div>
    );
}

const inp = {
    width: '100%', padding: '10px 13px',
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: '14px', outline: 'none',
};