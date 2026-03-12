import { FiFolder, FiBook, FiMonitor, FiHome, FiClock, FiLoader, FiCheckCircle, FiAlertCircle, FiCalendar } from 'react-icons/fi';

const CAT_OPTS = {
    'ทั่วไป':  { Icon: FiFolder,  color: '#92400e' },
    'เรียน':   { Icon: FiBook,    color: '#0c4a6e' },
    'ทำงาน':  { Icon: FiMonitor, color: '#5b21b6' },
    'ส่วนตัว': { Icon: FiHome,    color: '#065f46' },
};

const STATUS_MAP = {
    'To-Do':       { Icon: FiClock,        dot: '#d97706', color: '#92400e', bg: '#fef3c7', label: 'รอดำเนินการ' },
    'In Progress': { Icon: FiLoader,       dot: '#0284c7', color: '#0c4a6e', bg: '#e0f2fe', label: 'กำลังทำ' },
    'Done':        { Icon: FiCheckCircle,  dot: '#16a34a', color: '#14532d', bg: '#dcfce7', label: 'เสร็จสิ้น' },
    'เลยกำหนด':   { Icon: FiAlertCircle,  dot: '#ef4444', color: '#991b1b', bg: '#fee2e2', label: 'เลยกำหนด' },
};

export default function TaskList({ tasks, onViewDetails }) {
    if (tasks.length === 0) {
        return (
        <div style={{
            textAlign: 'center', padding: '64px 20px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', boxShadow: 'var(--shadow-sm)',
        }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌿</div>
            <p style={{ fontSize: '15px', color: 'var(--text2)', fontWeight: '500' }}>ไม่มีงานที่ตรงกับเงื่อนไข</p>
            <p style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>ลองเปลี่ยนตัวกรอง หรือเพิ่มงานใหม่ได้เลย</p>
        </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.map(task => {
            const isOverdue = task.status === 'เลยกำหนด';
            const isDone    = task.status === 'Done';
            const s = STATUS_MAP[task.status] || STATUS_MAP['To-Do'];
            const cat = CAT_OPTS[task.category];

            return (
            <div key={task.id} style={{
                background: isOverdue ? '#fff8f8' : 'var(--surface)',
                border: `1px solid ${isOverdue ? '#fca5a5' : 'var(--border)'}`,
                borderRadius: 'var(--r)', padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.15s, transform 0.15s',
            }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
                {/* Color stripe */}
                <div style={{ width: '4px', height: '44px', borderRadius: '99px', flexShrink: 0, background: s.dot }} />

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '15px', fontWeight: '600', marginBottom: '8px',
                    color: isDone ? 'var(--text3)' : isOverdue ? '#dc2626' : 'var(--text)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{task.title}</div>

                <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Category */}
                    <Pill bg="var(--bg2)" color="var(--text2)">
                    {cat ? <cat.Icon size={11} color={cat.color} /> : null}
                    {task.category}
                    </Pill>
                    {/* Status */}
                    <Pill bg={s.bg} color={s.color}>
                    <s.Icon size={11} color={s.color} />
                    {s.label}
                    </Pill>
                    {/* Due date */}
                    {task.dueDate && (
                    <Pill bg={isOverdue ? '#fee2e2' : 'var(--bg2)'} color={isOverdue ? '#991b1b' : 'var(--text3)'}>
                        <FiCalendar size={11} color={isOverdue ? '#991b1b' : 'var(--text3)'} />
                        {new Date(task.dueDate).toLocaleDateString('th-TH')}
                    </Pill>
                    )}
                </div>
                </div>

                <button onClick={() => onViewDetails(task)} style={{
                padding: '8px 18px', background: 'var(--bg)',
                border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)',
                color: 'var(--text2)', fontSize: '13px', fontWeight: '500',
                cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
                >
                ดูรายละเอียด →
                </button>
            </div>
            );
        })}
        </div>
    );
}

function Pill({ children, color, bg }) {
    return (
        <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: '99px', background: bg,
        color, fontSize: '12px', fontWeight: '500',
        }}>
        {children}
        </span>
    );
}