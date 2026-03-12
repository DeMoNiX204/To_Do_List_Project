import { useState, useRef, useEffect } from 'react';
import { FiFolder, FiBook, FiMonitor, FiHome, FiTrash2, FiSave, FiX, FiCalendar } from 'react-icons/fi';

const CAT_OPTS = [
    { v: 'ทั่วไป',  Icon: FiFolder,  color: '#92400e', bg: '#fef3c7' },
    { v: 'เรียน',   Icon: FiBook,    color: '#0c4a6e', bg: '#e0f2fe' },
    { v: 'ทำงาน',  Icon: FiMonitor, color: '#5b21b6', bg: '#ede9fe' },
    { v: 'ส่วนตัว', Icon: FiHome,    color: '#065f46', bg: '#d1fae5' },
];

const STATUS_OPTS = [
    { v: 'To-Do',       label: 'รอดำเนินการ', color: '#92400e', bg: '#fef3c7' },
    { v: 'In Progress', label: 'กำลังทำ',      color: '#0c4a6e', bg: '#e0f2fe' },
    { v: 'Done',        label: 'เสร็จสิ้น',    color: '#14532d', bg: '#dcfce7' },
    { v: 'เลยกำหนด',   label: 'เลยกำหนด',    color: '#991b1b', bg: '#fee2e2' },
];

export default function TaskDetailModal({ task, onClose, onUpdateTask, onDelete }) {
    const [status, setStatus]   = useState(task.status);
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [category, setCategory] = useState(task.category || 'ทั่วไป');
    const [catOpen, setCatOpen] = useState(false);
    const popRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        const h = e => {
        if (popRef.current && !popRef.current.contains(e.target) &&
            btnRef.current && !btnRef.current.contains(e.target)) setCatOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const isOverdue = status === 'เลยกำหนด';
    const selected = CAT_OPTS.find(c => c.v === category);

    const handleUpdate = () => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะบันทึกการแก้ไข?')) {
        onUpdateTask(task.id, { status, dueDate, category });
        onClose();
        }
    };

    const handleDelete = () => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบงานนี้? ข้อมูลจะหายไปถาวร!')) {
        onDelete(task.id);
        onClose();
        }
    };

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
                    เลยกำหนด
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
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}><FiX size={15} /></button>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {/* Category popover */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>หมวดหมู่</p>
                <div style={{ position: 'relative' }}>
                <button ref={btnRef} type="button" onClick={() => setCatOpen(o => !o)} style={{
                    display: 'flex', alignItems: 'center', gap: '7px', padding: '0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: selected?.color || 'var(--text)', fontSize: '14px', fontWeight: '600',
                }}>
                    {selected && <selected.Icon size={14} color={selected.color} />}
                    {category}
                    <span style={{ fontSize: '9px', opacity: 0.4 }}>{catOpen ? '▲' : '▼'}</span>
                </button>
                {catOpen && (
                    <div ref={popRef} style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r)', padding: '6px',
                    boxShadow: 'var(--shadow-lg)', minWidth: '160px', zIndex: 400,
                    animation: 'popIn 0.12s ease',
                    }}>
                    <style>{`@keyframes popIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
                    {CAT_OPTS.map(c => (
                        <button key={c.v} type="button" onClick={() => { setCategory(c.v); setCatOpen(false); }} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', padding: '8px 10px', borderRadius: '8px',
                        background: category === c.v ? c.bg : 'none', border: 'none',
                        color: category === c.v ? c.color : 'var(--text)',
                        fontSize: '14px', fontWeight: category === c.v ? '600' : '400',
                        cursor: 'pointer',
                        }}
                        onMouseEnter={e => { if (category !== c.v) e.currentTarget.style.background = 'var(--bg2)'; }}
                        onMouseLeave={e => { if (category !== c.v) e.currentTarget.style.background = 'none'; }}
                        >
                        <c.Icon size={14} color={category === c.v ? c.color : 'var(--text3)'} /> {c.v}
                        {category === c.v && <span style={{ marginLeft: 'auto' }}>✓</span>}
                        </button>
                    ))}
                    </div>
                )}
                </div>
            </div>

            {/* Due date */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>วันที่ต้องเสร็จ</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiCalendar size={14} color={isOverdue ? '#dc2626' : 'var(--text3)'} />
                <input 
                    type="date" 
                    value={dueDate} 
                    onChange={e => {
                        setDueDate(e.target.value);
                        // 🌟 LOGIC: ถ้าแก้วันที่ และสถานะเดิมคือ 'เลยกำหนด' ให้ปลดล็อกกลับเป็น 'To-Do'
                        if (status === 'เลยกำหนด') {
                            setStatus('To-Do');
                        }
                    }} 
                    style={{
                        background: 'none', border: 'none', outline: 'none', fontSize: '14px',
                        color: isOverdue ? '#dc2626' : 'var(--text)', fontFamily: 'Bricolage Grotesque, sans-serif',
                        cursor: 'pointer', fontWeight: '500',
                    }} 
                />
                </div>
            </div>
            </div>

            {/* Description */}
            {task.description && (
            <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: '14px', marginBottom: '18px',
            }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>รายละเอียด</p>
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{task.description}</p>
            </div>
            )}

            {/* Status selector */}
            <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px' }}>อัปเดตสถานะ</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {STATUS_OPTS.map(o => {
                    // 🌟 LOGIC: เช็กว่าปุ่มนี้ควรจะถูกล็อกไม่ให้กดหรือไม่
                    const isLockedByOverdue = status === 'เลยกำหนด'; // ถ้าติดสถานะเลยกำหนด ล็อกทุกปุ่ม
                    const isOverdueBtn = o.v === 'เลยกำหนด';         // ปุ่ม "เลยกำหนด" ห้ามผู้ใช้กดเลือกเองเด็ดขาด
                    const isDisabled = isLockedByOverdue || isOverdueBtn;

                    return (
                        <button 
                            key={o.v} 
                            disabled={isDisabled}
                            onClick={() => {
                                if (!isDisabled) setStatus(o.v);
                            }} 
                            style={{
                                padding: '9px 4px', borderRadius: 'var(--r-sm)', fontSize: '12px',
                                fontWeight: status === o.v ? '600' : '400', 
                                cursor: isDisabled ? (status === o.v ? 'default' : 'not-allowed') : 'pointer', 
                                transition: 'all 0.12s',
                                background: status === o.v ? o.bg : 'var(--bg)',
                                border: `1px solid ${status === o.v ? o.color + '55' : 'var(--border)'}`,
                                color: status === o.v ? o.color : 'var(--text3)',
                                opacity: isDisabled && status !== o.v ? 0.5 : 1 // ดรอปสีปุ่มที่กดไม่ได้ให้จางลงนิดนึง
                            }}
                        >
                            {o.label}
                        </button>
                    );
                })}
            </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDelete} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 'var(--r-sm)', color: '#b91c1c', fontSize: '14px', cursor: 'pointer', fontWeight: '500',
            }}><FiTrash2 size={14} /> ลบงานนี้</button>
            <div style={{ flex: 1 }} />
            <button onClick={onClose} style={{
                padding: '10px 18px', background: 'var(--bg)', border: '1px solid var(--border2)',
                borderRadius: 'var(--r-sm)', color: 'var(--text2)', fontSize: '14px', cursor: 'pointer',
            }}>ปิด</button>
            <button onClick={handleUpdate} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 24px', background: 'var(--accent)', border: 'none',
                borderRadius: 'var(--r-sm)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            }}><FiSave size={14} /> บันทึก</button>
            </div>
        </div>
        </div>
    );
}