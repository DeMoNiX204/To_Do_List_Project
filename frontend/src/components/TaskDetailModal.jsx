import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiFolder, FiBook, FiMonitor, FiHome, FiTrash2, FiSave, FiX, FiCalendar, FiAlertTriangle } from 'react-icons/fi';

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
    const [status, setStatus]     = useState(task.status);
    const [dueDate, setDueDate]   = useState(task.dueDate || '');
    const [category, setCategory] = useState(task.category || 'ทั่วไป');
    const [catOpen, setCatOpen]   = useState(false);
    const [confirm, setConfirm]   = useState(null);
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

    const handleUpdate = () => setConfirm({
        msg: 'บันทึกการแก้ไขงานนี้?',
        danger: false,
        onOk: () => { onUpdateTask(task.id, { status, dueDate, category }); onClose(); },
    });

    const handleDelete = () => setConfirm({
        msg: 'ลบงานนี้? ข้อมูลจะหายไปถาวร',
        danger: true,
        onOk: () => { onDelete(task.id); onClose(); },
    });

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
            position: 'relative',
        }}>
            <style>{`@keyframes popIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div style={{ flex: 1, paddingRight: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>รายละเอียดงาน</p>
                {isOverdue && (
                    <span style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '600' }}>เลยกำหนด</span>
                )}
                </div>
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: '22px', fontWeight: '500', color: 'var(--text)', lineHeight: 1.3 }}>{task.title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiX size={15} />
            </button>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {/* Category */}
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px 14px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>หมวดหมู่</p>
                <div style={{ position: 'relative' }}>
                <button ref={btnRef} type="button" onClick={() => setCatOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: selected ? selected.color : 'var(--text)', fontSize: '14px', fontWeight: '600' }}>
                    {selected && <selected.Icon size={14} color={selected.color} />}
                    {category}
                    <span style={{ fontSize: '9px', opacity: 0.4 }}>{catOpen ? '▲' : '▼'}</span>
                </button>
                {catOpen && (
                    <div ref={popRef} style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '6px', boxShadow: 'var(--shadow-lg)', minWidth: '160px', zIndex: 400, animation: 'popIn 0.12s ease' }}>
                    {CAT_OPTS.map(c => (
                        <button key={c.v} type="button" onClick={() => { setCategory(c.v); setCatOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 10px', borderRadius: '8px', background: category === c.v ? c.bg : 'none', border: 'none', color: category === c.v ? c.color : 'var(--text)', fontSize: '14px', fontWeight: category === c.v ? '600' : '400', cursor: 'pointer' }}
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
                <style>{`
                .fb-dp .react-datepicker-wrapper{width:100%}
                .fb-dp input{border:none;outline:none;background:none;font-family:'Bricolage Grotesque',sans-serif;font-size:14px;font-weight:500;cursor:pointer;color:${isOverdue ? '#dc2626' : 'var(--text)'};}
                .react-datepicker{font-family:'Bricolage Grotesque',sans-serif!important;border:1px solid var(--border)!important;border-radius:12px!important;box-shadow:0 8px 40px rgba(0,0,0,0.12)!important;overflow:hidden}
                .react-datepicker__header{background:var(--accent)!important;border-bottom:none!important;border-radius:0!important;padding:12px 0 8px!important}
                .react-datepicker__current-month{color:#fff!important;font-weight:600!important;font-size:14px!important}
                .react-datepicker__day-name{color:rgba(255,255,255,0.7)!important;font-size:11px!important}
                .react-datepicker__day{border-radius:8px!important;font-size:13px!important;color:var(--text)!important}
                .react-datepicker__day:hover{background:var(--accent-light)!important;color:var(--accent)!important}
                .react-datepicker__day--selected{background:var(--accent)!important;color:#fff!important;font-weight:600!important}
                .react-datepicker__day--today{font-weight:700!important;color:var(--accent)!important}
                .react-datepicker__day--today.react-datepicker__day--selected{color:#fff!important}
                .react-datepicker__navigation-icon::before{border-color:rgba(255,255,255,0.8)!important}
                .react-datepicker__triangle{display:none!important}
                .react-datepicker__today-button{background:none!important;color:var(--accent)!important;font-weight:600!important;font-size:11px!important;border-top:1px solid var(--border)!important;padding:6px 10px!important;text-align:right!important;}
                `}</style>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="fb-dp">
                <FiCalendar size={14} color={isOverdue ? '#dc2626' : 'var(--text3)'} />
                <DatePicker
                    selected={dueDate ? new Date(dueDate) : null}
                    onChange={date => {
                    const val = date ? `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` : '';
                    setDueDate(val);
                    if (status === 'เลยกำหนด') setStatus('To-Do');
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="เลือกวันที่..."
                    popperPlacement="bottom-start"
                todayButton="วันนี้"
                />
                </div>
            </div>
            </div>

            {/* Description */}
            {task.description && (
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '14px', marginBottom: '18px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>รายละเอียด</p>
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{task.description}</p>
            </div>
            )}

            {/* Status */}
            <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px' }}>อัปเดตสถานะ</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {STATUS_OPTS.map(o => {
                const locked = status === 'เลยกำหนด';
                const isOverdueBtn = o.v === 'เลยกำหนด';
                const disabled = locked || isOverdueBtn;
                return (
                    <button key={o.v} disabled={disabled} onClick={() => { if (!disabled) setStatus(o.v); }}
                    style={{ padding: '9px 4px', borderRadius: 'var(--r-sm)', fontSize: '12px', fontWeight: status === o.v ? '600' : '400', cursor: disabled ? (status === o.v ? 'default' : 'not-allowed') : 'pointer', transition: 'all 0.12s', background: status === o.v ? o.bg : 'var(--bg)', border: `1px solid ${status === o.v ? o.color + '55' : 'var(--border)'}`, color: status === o.v ? o.color : 'var(--text3)', opacity: disabled && status !== o.v ? 0.5 : 1 }}>
                    {o.label}
                    </button>
                );
                })}
            </div>
            {isOverdue && (
                <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>*</span> งานนี้เลยกำหนดแล้ว กรุณาเลื่อน "วันที่ต้องเสร็จ" เพื่อปลดล็อกสถานะ
                </p>
            )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--r-sm)', color: '#b91c1c', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
                <FiTrash2 size={14} /> ลบงานนี้
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={onClose} style={{ padding: '10px 18px', background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', color: 'var(--text2)', fontSize: '14px', cursor: 'pointer' }}>ปิด</button>
            <button onClick={handleUpdate} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--r-sm)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                <FiSave size={14} /> บันทึก
            </button>
            </div>

            {/* Confirm Dialog */}
            {confirm && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,23,20,0.5)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '24px' }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: '24px', width: '100%', maxWidth: '300px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', animation: 'popIn 0.15s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: confirm.danger ? '#fee2e2' : 'var(--accent-light)' }}>
                    <FiAlertTriangle size={18} color={confirm.danger ? '#dc2626' : 'var(--accent)'} />
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', lineHeight: 1.4 }}>{confirm.msg}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setConfirm(null)} style={{ padding: '9px 18px', background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)', color: 'var(--text2)', fontSize: '14px', cursor: 'pointer' }}>ยกเลิก</button>
                    <button onClick={() => { confirm.onOk(); setConfirm(null); }} style={{ padding: '9px 18px', background: confirm.danger ? '#dc2626' : 'var(--accent)', border: 'none', borderRadius: 'var(--r-sm)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    {confirm.danger ? 'ลบเลย' : 'บันทึก'}
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}