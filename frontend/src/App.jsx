import { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskDetailModal from './components/TaskDetailModal';
import Auth from './components/Auth';
import './App.css';

const CATEGORIES = ['ทั้งหมด', 'ทั่วไป', 'เรียน', 'ทำงาน', 'ส่วนตัว'];
const CAT_ICONS  = { 'ทั้งหมด': '◈', 'ทั่วไป': '📁', 'เรียน': '📚', 'ทำงาน': '💻', 'ส่วนตัว': '🏠' };

export default function App() {
  const [tasks, setTasks]               = useState([]);
  const [token, setToken]               = useState(localStorage.getItem('token'));
  const [username, setUsername]         = useState(localStorage.getItem('username'));
  const [filterCat, setFilterCat]       = useState('ทั้งหมด');
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery]   = useState('');
  const [addOpen, setAddOpen]           = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [popOpen, setPopOpen]           = useState(false);
  const [isMobile, setIsMobile]         = useState(window.innerWidth < 640);
  const popRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const h = e => {
      if (popRef.current && !popRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) setPopOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('username');
    setToken(null); setUsername(''); setTasks([]);
  };

  useEffect(() => {
    if (!token) return;
    fetch('https://to-do-list-project-c0x1.onrender.com/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.message?.includes('Token')) { logout(); return; }
        setTasks(data.map(t => ({ ...t, id: t._id })));
      }).catch(console.error);
  }, [token]);

  const addTask = async (d) => {
    try {
      const res = await fetch('https://to-do-list-project-c0x1.onrender.com/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...d, status: 'To-Do', tags: [] }),
      });
      const saved = await res.json();
      if (res.ok) { saved.id = saved._id; setTasks(p => [saved, ...p]); setAddOpen(false); }
      else alert('❌ เพิ่มงานไม่สำเร็จ: ' + saved.message);
    } catch (err) { console.error(err); alert('❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'); }
  };

  const deleteTask = async (id) => {
    const res = await fetch(`https://to-do-list-project-c0x1.onrender.com/api/tasks/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTasks(p => p.filter(t => t.id !== id));
  };

  const updateTask = async (id, data) => {
    try {
      const res = await fetch(`https://to-do-list-project-c0x1.onrender.com/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const u = await res.json(); u.id = u._id;
        setTasks(p => p.map(t => t.id === id ? u : t));
      } else {
        const e = await res.json(); alert('❌ อัปเดตไม่สำเร็จ: ' + e.message);
      }
    } catch (err) { console.error(err); }
  };

  const filtered = tasks.filter(t => {
    const matchCat    = filterCat === 'ทั้งหมด' || t.category === filterCat;
    const matchStatus = filterStatus === 'ทั้งหมด' || t.status === filterStatus;
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  if (!token) return <Auth onLoginSuccess={(t, u) => { setToken(t); setUsername(u); }} />;

  const pad = isMobile ? '16px' : '32px';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ══ NAVBAR ══ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--navbar-h)',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: `0 ${pad}`, gap: '12px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontSize: '15px', fontWeight: '700',
          }}>✦</div>
          <span style={{
            fontWeight: '800', fontSize: '14px', color: 'var(--text)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>FocusBoard</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* User pill + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '5px 10px', background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: '99px', fontSize: '13px', color: 'var(--text2)',
          }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0,
            }}>{username?.[0]?.toUpperCase()}</div>
            {!isMobile && username}
          </div>
          <button onClick={logout} style={{
            padding: '6px 12px', background: 'none',
            border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
            color: 'var(--text3)', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)'; }}
          >{isMobile ? 'ออก' : 'ออกจากระบบ'}</button>
        </div>
      </header>

      {/* ══ CONTENT ══ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '16px 16px' : '28px 32px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '10px', marginTop: '0px' }}>
            {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{
            fontFamily: 'Lora, serif', fontSize: isMobile ? '28px' : '36px', fontWeight: '500',
            color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: '4px',
          }}>
            {filterCat === 'ทั้งหมด' ? 'งานทั้งหมด' : `หมวด: ${filterCat}`}
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: '13px', marginBottom: '16px' }}>
            {filtered.length} รายการ{filtered.length !== tasks.length ? ` (จากทั้งหมด ${tasks.length})` : ''}
          </p>

          {/* ── Controls ── */}
          {isMobile ? (
            /* Mobile: stack vertically */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Row 1: category + status */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Category popover */}
                <div style={{ position: 'relative', flex: 1 }}>
                  <button ref={btnRef} onClick={() => setPopOpen(o => !o)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '7px', padding: '10px 14px',
                    background: popOpen ? 'var(--accent-light)' : 'var(--surface)',
                    border: `1px solid ${popOpen ? 'var(--accent)' : 'var(--border2)'}`,
                    borderRadius: 'var(--r-sm)', color: popOpen ? 'var(--accent)' : 'var(--text2)',
                    fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                  }}>
                    <span>{CAT_ICONS[filterCat]} {filterCat}</span>
                    <span style={{ fontSize: '9px', opacity: 0.5 }}>{popOpen ? '▲' : '▼'}</span>
                  </button>
                  {popOpen && <CategoryPopover ref={popRef} filterCat={filterCat} setFilterCat={setFilterCat} setPopOpen={setPopOpen} />}
                </div>
                {/* Status */}
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{
                  flex: 1, padding: '10px 10px', background: 'var(--surface)',
                  border: '1px solid var(--border2)', borderRadius: 'var(--r-sm)',
                  color: 'var(--text2)', fontSize: '13px', outline: 'none', cursor: 'pointer',
                }}>
                  <option value="ทั้งหมด">📌 ทุกสถานะ</option>
                  <option value="To-Do">⏳ รอดำเนินการ</option>
                  <option value="In Progress">🚀 กำลังทำ</option>
                  <option value="Done">✅ เสร็จสิ้น</option>
                  <option value="เลยกำหนด">⚠️ เลยกำหนด</option>
                </select>
              </div>
              {/* Row 2: search + add */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)', padding: '0 12px',
                }}>
                  <span style={{ color: 'var(--text3)', fontSize: '14px' }}>🔍</span>
                  <input type="text" placeholder="ค้นหาชื่องาน..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', padding: '10px 0', background: 'transparent', color: 'var(--text)', fontSize: '13px' }} />
                </div>
                <button onClick={() => setAddOpen(true)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                  padding: '10px 16px', background: 'var(--accent)', border: 'none',
                  borderRadius: 'var(--r-sm)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> เพิ่ม
                </button>
              </div>
            </div>
          ) : (
            /* Desktop: single row */
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button ref={btnRef} onClick={() => setPopOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px',
                  background: popOpen ? 'var(--accent-light)' : 'var(--surface)',
                  border: `1px solid ${popOpen ? 'var(--accent)' : 'var(--border2)'}`,
                  borderRadius: 'var(--r-sm)', color: popOpen ? 'var(--accent)' : 'var(--text2)',
                  fontSize: '13px', fontWeight: '500', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
                }}>
                  <span>{CAT_ICONS[filterCat]}</span><span>{filterCat}</span>
                  <span style={{ fontSize: '9px', opacity: 0.5, marginLeft: '2px' }}>{popOpen ? '▲' : '▼'}</span>
                </button>
                {popOpen && <CategoryPopover ref={popRef} filterCat={filterCat} setFilterCat={setFilterCat} setPopOpen={setPopOpen} />}
              </div>

              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{
                padding: '9px 14px', background: 'var(--surface)', border: '1px solid var(--border2)',
                borderRadius: 'var(--r-sm)', color: 'var(--text2)', fontSize: '13px',
                fontWeight: '500', outline: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              }}>
                <option value="ทั้งหมด">📌 ทุกสถานะ</option>
                <option value="To-Do">⏳ รอดำเนินการ</option>
                <option value="In Progress">🚀 กำลังทำ</option>
                <option value="Done">✅ เสร็จสิ้น</option>
                <option value="เลยกำหนด">⚠️ เลยกำหนด</option>
              </select>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)', padding: '0 14px', width: '240px', boxShadow: 'var(--shadow-sm)',
              }}>
                <span style={{ color: 'var(--text3)', fontSize: '14px' }}>🔍</span>
                <input type="text" placeholder="ค้นหาชื่องาน..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', padding: '9px 0', background: 'transparent', color: 'var(--text)', fontSize: '13px' }} />
              </div>

              <div style={{ flex: 1 }} />

              <button onClick={() => setAddOpen(true)} style={{
                display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                padding: '10px 22px', background: 'var(--accent)', border: 'none',
                borderRadius: 'var(--r)', color: '#fff', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,71,49,0.3)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none'; }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> เพิ่มงานใหม่
              </button>
            </div>
          )}
        </div>

        <Dashboard tasks={tasks} isMobile={isMobile} />
        <TaskList tasks={filtered} onViewDetails={setSelectedTask} />
      </div>

      {addOpen && <TaskForm onAddTask={addTask} onClose={() => setAddOpen(false)} />}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

function CategoryPopover({ filterCat, setFilterCat, setPopOpen }, ref) {
  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 8px)', left: 0,
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '6px',
      boxShadow: 'var(--shadow-lg)', minWidth: '190px', zIndex: 300,
      animation: 'popIn 0.12s ease',
    }}>
      <style>{`@keyframes popIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <p style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '6px 10px 8px' }}>
        หมวดหมู่
      </p>
      {['ทั้งหมด', 'ทั่วไป', 'เรียน', 'ทำงาน', 'ส่วนตัว'].map(cat => (
        <button key={cat} onClick={() => { setFilterCat(cat); setPopOpen(false); }} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          width: '100%', padding: '8px 10px', borderRadius: '8px',
          background: filterCat === cat ? 'var(--accent-light)' : 'none', border: 'none',
          color: filterCat === cat ? 'var(--accent)' : 'var(--text)',
          fontSize: '14px', fontWeight: filterCat === cat ? '600' : '400',
          cursor: 'pointer', textAlign: 'left',
        }}>
          <span>{{ 'ทั้งหมด': '◈', 'ทั่วไป': '📁', 'เรียน': '📚', 'ทำงาน': '💻', 'ส่วนตัว': '🏠' }[cat]}</span> {cat}
          {filterCat === cat && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>✓</span>}
        </button>
      ))}
    </div>
  );
}