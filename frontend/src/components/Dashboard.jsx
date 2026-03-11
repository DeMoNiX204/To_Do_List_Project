export default function Dashboard({ tasks }) {
    const total  = tasks.length;
    const todo   = tasks.filter(t => t.status === 'To-Do').length;
    const inProg = tasks.filter(t => t.status === 'In Progress').length;
    const done   = tasks.filter(t => t.status === 'Done').length;
    const pct    = total > 0 ? Math.round((done / total) * 100) : 0;

    const stats = [
        { label: 'งานทั้งหมด',     value: total,  color: 'var(--accent)', bg: 'var(--accent-light)', border: '#1a473122' },
        { label: 'รอดำเนินการ',    value: todo,   color: 'var(--warn)',   bg: 'var(--warn-bg)',      border: '#92400e22' },
        { label: 'กำลังดำเนินการ', value: inProg, color: 'var(--info)',   bg: 'var(--info-bg)',      border: '#0c4a6e22' },
        { label: 'เสร็จสิ้นแล้ว',  value: done,   color: 'var(--ok)',     bg: 'var(--ok-bg)',        border: '#14532d22' },
    ];

    return (
        <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '14px' }}>
            {stats.map(s => (
            <div key={s.label} style={{
                background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: 'var(--r)', padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ fontSize: '34px', fontWeight: '700', color: s.color, fontFamily: 'Lora, serif', lineHeight: 1, marginBottom: '6px' }}>
                {s.value}
                </div>
                <div style={{ fontSize: '13px', color: s.color, fontWeight: '500', opacity: 0.75 }}>{s.label}</div>
            </div>
            ))}
        </div>

        <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '16px 22px',
            boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '18px',
        }}>
            <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: '500' }}>ความคืบหน้าโดยรวม</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)' }}>{pct}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--bg2)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                height: '100%', width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--accent), #4a9b6a)',
                borderRadius: '99px', transition: 'width 0.5s ease',
                }} />
            </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', flexShrink: 0 }}>{done} / {total} งาน</div>
        </div>
        </div>
    );
}