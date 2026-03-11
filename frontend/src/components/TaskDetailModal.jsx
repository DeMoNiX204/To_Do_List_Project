import { useState } from 'react';

const CAT_ICON = { 'ทั่วไป': '📁', 'เรียน': '📚', 'ทำงาน': '💻', 'ส่วนตัว': '🏠' };

export default function TaskDetailModal({ task, onClose, onUpdateTask, onDelete }) {
    const [status, setStatus]   = useState(task.status);
    const [dueDate, setDueDate] = useState(task.dueDate || '');

    const isOverdue = status === 'เลยกำหนด';

    const handleUpdate = () => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะบันทึกการแก้ไข (สถานะ / วันที่) นี้?')) {
        onUpdateTask(task.id, { status, dueDate });
        onClose();
        }
    };

    const handleDelete = () => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะ "ลบ" งานนี้? ข้อมูลจะหายไปถาวรนะ!')) {
        onDelete(task.id);
        onClose();
        }
    };

    const STATUS_OPTS = [
        { v: 'To-Do',       label: 'รอดำเนินการ', color: '#d97706', bg: '#fef3c7' },
        { v: 'In Progress', label: 'กำลังทำ',      color: '#0284c7', bg: '#e0f2fe' },
        { v: 'Done',        label: 'เสร็จสิ้น',    color: '#16a34a', bg: '#dcfce7' },
        { v: 'เลยกำหนด',   label: 'เลยกำหนด',    color: '#dc2626', bg: '#fee2e2' },
    ];

    return (
        <div style={{
        position: 'fixed', inset: 0, background: 'rgba(26,23,20,0.45)',
        backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 9999, padding: '20px',
        }} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{
            background: 'var(--surface)', borderRadius: 'var(--r-lg)',
            padding: '32px', width: '100%', maxWidth: '520px',
            boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div style={{ flex: 1, paddingRight: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                    รายละเอียดงาน
                </p>
                {isOverdue && (
                    <span style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600' }}>
                    ⚠️ เลยกำหนด
                    </span>
                )}
                </div>
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: '500', color: 'var(--text)', lineHeight: 1.3 }}>
                {task.title}
                </h2>
            </div>
            <button onClick={onClose} style={{
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text2)',
                fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>×</button>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <InfoBox label="หมวดหมู่">{CAT_ICON[task.category]} {task.category}</InfoBox>
            <InfoBox label="วันที่ต้องเสร็จ">
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{
                background: 'none', border: 'none', outline: 'none', fontSize: '14px',
                color: isOverdue ? '#dc2626' : 'var(--text)', fontFamily: 'Bricolage Grotesque, sans-serif',
                cursor: 'pointer', width: '100%', fontWeight: '500',
                }} />
            </InfoBox>
            </div>

            {/* Description */}
            {task.description && (
            <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: '14px', marginBottom: '18px',
            }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>รายละเอียด</p>
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {task.description || 'ไม่มีรายละเอียด'}
                </p>
            </div>
            )}

            {/* Status selector */}
            <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px' }}>
                อัปเดตสถานะ
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {STATUS_OPTS.map(o => (
                <button key={o.v} onClick={() => setStatus(o.v)} style={{
                    padding: '9px 4px', borderRadius: 'var(--r-sm)', fontSize: '12px',
                    fontWeight: status === o.v ? '600' : '400', cursor: 'pointer', transition: 'all 0.12s',
                    background: status === o.v ? o.bg : 'var(--bg)',
                    border: `1px solid ${status === o.v ? o.color + '55' : 'var(--border)'}`,
                    color: status === o.v ? o.color : 'var(--text3)',
                }}>{o.label}</button>
                ))}
            </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDelete} style={{
                padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 'var(--r-sm)', color: '#b91c1c', fontSize: '14px', cursor: 'pointer', fontWeight: '500',
            }}>🗑 ลบงานนี้</button>
            <div style={{ flex: 1 }} />
            <button onClick={onClose} style={{
                padding: '10px 18px', background: 'var(--bg)', border: '1px solid var(--border2)',
                borderRadius: 'var(--r-sm)', color: 'var(--text2)', fontSize: '14px', cursor: 'pointer',
            }}>ปิด</button>
            <button onClick={handleUpdate} style={{
                padding: '10px 24px', background: 'var(--accent)', border: 'none',
                borderRadius: 'var(--r-sm)', color: '#fff', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
            }}>💾 บันทึก</button>
            </div>
        </div>
        </div>
    );
}

function InfoBox({ label, children }) {
    return (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}>
        <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px' }}>{label}</p>
        <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>{children}</p>
        </div>
    );
}