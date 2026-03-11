import { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async e => {
        e.preventDefault(); setError('');
        if (!isLogin && password !== confirmPw) return setError('รหัสผ่านไม่ตรงกัน');
        setLoading(true);
        try {
        const res = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isLogin ? { username, password } : { username, email, password, confirmPassword: confirmPw }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');
        if (isLogin) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            onLoginSuccess(data.token, data.user.username);
        } else {
            alert('สมัครสำเร็จ! กรุณาเข้าสู่ระบบ');
            setIsLogin(true); setPassword(''); setConfirmPw('');
        }
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
        {/* Left panel */}
        <div style={{
            width: '42%', background: 'var(--accent)', display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end', padding: '60px', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '40px', left: '40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
            <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', marginBottom: '24px' }}>✦ TASKFLOW</div>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '44px', fontWeight: '400', color: '#fff', lineHeight: '1.15', marginBottom: '20px', fontStyle: 'italic' }}>
                จัดระเบียบ<br />ชีวิตให้ง่าย<br />กว่าเดิม
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7', maxWidth: '280px' }}>
                ติดตามงาน วางแผน และทำสิ่งสำคัญให้เสร็จทุกวัน
            </p>
            </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '30px', fontWeight: '400', color: 'var(--text)', marginBottom: '6px' }}>
                {isLogin ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีใหม่'}
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: '14px', marginBottom: '28px' }}>
                {isLogin ? 'กรอกข้อมูลเพื่อเข้าสู่ระบบ' : 'เริ่มต้นฟรี ไม่มีค่าใช้จ่าย'}
            </p>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--r-sm)', fontSize: '13px', marginBottom: '18px' }}>
                ⚠ {error}
                </div>
            )}

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                { label: 'ชื่อผู้ใช้', type: 'text',     val: username,  set: setUsername,  ph: 'username',        show: true },
                { label: 'อีเมล',      type: 'email',    val: email,     set: setEmail,     ph: 'you@example.com', show: !isLogin },
                { label: 'รหัสผ่าน',   type: 'password', val: password,  set: setPassword,  ph: '••••••••',         show: true },
                { label: 'ยืนยันรหัส', type: 'password', val: confirmPw, set: setConfirmPw, ph: '••••••••',         show: !isLogin },
                ].filter(f => f.show).map(f => (
                <div key={f.label}>
                    <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.ph} value={f.val}
                    onChange={e => f.set(e.target.value)} required
                    style={{ width: '100%', padding: '11px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: '14px', outline: 'none' }} />
                </div>
                ))}
                <button type="submit" disabled={loading} style={{
                marginTop: '6px', padding: '13px',
                background: loading ? 'var(--border2)' : 'var(--accent)',
                border: 'none', borderRadius: 'var(--r-sm)', color: '#fff',
                fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? 'กำลังดำเนินการ...' : isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '14px', color: 'var(--text3)' }}>
                {isLogin ? 'ยังไม่มีบัญชี? ' : 'มีบัญชีอยู่แล้ว? '}
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{
                background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px', textDecoration: 'underline', textUnderlineOffset: '3px',
                }}>
                {isLogin ? 'สมัครที่นี่' : 'เข้าสู่ระบบ'}
                </button>
            </p>
            </div>
        </div>
        </div>
    );
}