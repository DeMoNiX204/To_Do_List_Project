import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiFolder, FiBook, FiMonitor, FiHome, FiCheck } from 'react-icons/fi';

const CAT_OPTS = [
    { v: 'ทั่วไป',  Icon: FiFolder,  color: '#92400e', bg: '#fef3c7' },
    { v: 'เรียน',   Icon: FiBook,    color: '#0c4a6e', bg: '#e0f2fe' },
    { v: 'ทำงาน',  Icon: FiMonitor, color: '#5b21b6', bg: '#ede9fe' },
    { v: 'ส่วนตัว', Icon: FiHome,    color: '#065f46', bg: '#d1fae5' },
];

export default function TaskForm({ onAddTask, onClose }) {
    const [title, setTitle]       = useState('');
    const [category, setCategory] = useState('ทั่วไป');
    const [description, setDesc]  = useState('');
    const [dueDate, setDueDate]   = useState('');
    const [catOpen, setCatOpen]   = useState(false);
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

    const handleSubmit = e => {
        e.preventDefault();
        if (!title.trim()) { alert('กรุณาระบุชื่องานด้วยครับ!'); return; }
        onAddTask({ title, category, description, dueDate });
    };

    const selected = CAT_OPTS.find(c => c.v === category);

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
                เพิ่มงานใหม่
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
                {/* Category custom popover */}
                <Field label="หมวดหมู่">
                <div style={{ position: 'relative' }}>
                    <button ref={btnRef} type="button" onClick={() => setCatOpen(o => !o)} style={{
                    ...inp, display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer', justifyContent: 'space-between',
                    background: catOpen ? selected?.bg : 'var(--surface2)',
                    border: `1px solid ${catOpen ? selected?.color + '66' : 'var(--border)'}`,
                    color: catOpen ? selected?.color : 'var(--text)',
                    }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {selected && <selected.Icon size={14} color={selected.color} />}
                        {category}
                    </span>
                    <span style={{ fontSize: '9px', opacity: 0.4 }}>{catOpen ? '▲' : '▼'}</span>
                    </button>

                    {catOpen && (
                    <div ref={popRef} style={{
                        position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r)', padding: '6px',
                        boxShadow: 'var(--shadow-lg)', minWidth: '100%', zIndex: 400,
                        animation: 'popIn 0.12s ease',
                    }}>
                        {CAT_OPTS.map(c => (
                        <button key={c.v} type="button" onClick={() => { setCategory(c.v); setCatOpen(false); }} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            width: '100%', padding: '8px 10px', borderRadius: '8px',
                            background: category === c.v ? c.bg : 'none', border: 'none',
                            color: category === c.v ? c.color : 'var(--text)',
                            fontSize: '14px', fontWeight: category === c.v ? '600' : '400',
                            cursor: 'pointer', textAlign: 'left',
                        }}
                            onMouseEnter={e => { if (category !== c.v) e.currentTarget.style.background = 'var(--bg2)'; }}
                            onMouseLeave={e => { if (category !== c.v) e.currentTarget.style.background = 'none'; }}
                        >
                            <c.Icon size={14} color={category === c.v ? c.color : 'var(--text3)'} />
                            {c.v}
                            {category === c.v && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓</span>}
                        </button>
                        ))}
                    </div>
                    )}
                </div>
                </Field>

                <Field label="วันที่ต้องเสร็จ">
                <div style={{ position: 'relative' }}>
                  <style>{`
                    .fb-datepicker-form .react-datepicker-wrapper { width: 100%; }
                    .fb-datepicker-form input {
                      width: 100%; padding: 10px 13px;
                      background: var(--surface2); border: 1px solid var(--border);
                      border-radius: var(--r-sm); color: var(--text);
                      font-size: 14px; outline: none; font-family: 'Bricolage Grotesque', sans-serif;
                      cursor: pointer;
                    }
                    .react-datepicker { font-family: 'Bricolage Grotesque', sans-serif !important; border: 1px solid var(--border) !important; border-radius: 12px !important; box-shadow: 0 8px 40px rgba(0,0,0,0.12) !important; overflow: hidden; }
                    .react-datepicker__header { background: var(--accent) !important; border-bottom: none !important; border-radius: 0 !important; padding: 12px 0 8px !important; }
                    .react-datepicker__current-month { color: #fff !important; font-weight: 600 !important; font-size: 14px !important; }
                    .react-datepicker__day-name { color: rgba(255,255,255,0.7) !important; font-size: 11px !important; }
                    .react-datepicker__day { border-radius: 8px !important; font-size: 13px !important; color: var(--text) !important; }
                    .react-datepicker__day:hover { background: var(--accent-light) !important; color: var(--accent) !important; }
                    .react-datepicker__day--selected { background: var(--accent) !important; color: #fff !important; font-weight: 600 !important; }
                    .react-datepicker__day--today { font-weight: 700 !important; color: var(--accent) !important; }
                    .react-datepicker__day--today.react-datepicker__day--selected { color: #fff !important; }
                    .react-datepicker__navigation-icon::before { border-color: rgba(255,255,255,0.8) !important; }
                    .react-datepicker__triangle { display: none !important; }
                    .react-datepicker__today-button{background:none!important;color:var(--accent)!important;font-weight:600!important;font-size:11px!important;border-top:1px solid var(--border)!important;padding:6px 10px!important;text-align:right!important;}
                  `}</style>
                  <div className="fb-datepicker-form">
                    <DatePicker
                      selected={dueDate ? new Date(dueDate) : null}
                      onChange={date => setDueDate(date ? `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` : '')}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="เลือกวันที่..."
                      popperPlacement="bottom-start"
                      todayButton="วันนี้"
                    />
                  </div>
                </div>
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
                }}><span style={{display:"flex",alignItems:"center",gap:"6px"}}><FiCheck size={15}/>บันทึกงาน</span></button>
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