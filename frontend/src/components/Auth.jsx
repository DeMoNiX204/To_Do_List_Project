import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin]         = useState(true);
    const [username, setUsername]       = useState('');
    const [email, setEmail]             = useState('');
    const [password, setPassword]       = useState('');
    const [confirmPw, setConfirmPw]     = useState('');
    const [loading, setLoading]         = useState(false);
    const [isMobile, setIsMobile]       = useState(window.innerWidth < 640);
    const [showPw, setShowPw]           = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [toast, setToast]             = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const validate = () => {
        const errs = {};
        if (!username.trim()) errs.username = 'กรุณาระบุชื่อผู้ใช้';
        if (!isLogin) {
        if (!email.trim()) errs.email = 'กรุณาระบุอีเมล';
        else if (!validateEmail(email)) errs.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        }
        if (!password) errs.password = 'กรุณาระบุรหัสผ่าน';
        else if (!isLogin && password.length < 6) errs.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        if (!isLogin && password !== confirmPw) errs.confirmPw = 'รหัสผ่านไม่ตรงกัน';
        return errs;
    };

    const submit = async e => {
        e.preventDefault();
        const errs = validate();
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setLoading(true);
        try {
        const res = await fetch(`https://to-do-list-project-c0x1.onrender.com/api/auth/${isLogin ? 'login' : 'register'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isLogin
            ? { username, password }
            : { username, email, password, confirmPassword: confirmPw }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');
        if (isLogin) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            onLoginSuccess(data.token, data.user.username);
        } else {
            showToast('สมัครสำเร็จ! กรุณาเข้าสู่ระบบ');
            setIsLogin(true); setPassword(''); setConfirmPw('');
        }
        } catch (err) {
        setFieldErrors({ server: err.message });
        } finally {
        setLoading(false);
        }
    };

    const clearErr = key => setFieldErrors(p => ({ ...p, [key]: '' }));

    const inputStyle = (key) => ({
        width: '100%', padding: '12px 14px',
        background: 'var(--surface)',
        border: `1px solid ${fieldErrors[key] ? '#fca5a5' : 'var(--border)'}`,
        borderRadius: 'var(--r-sm)', color: 'var(--text)',
        fontSize: '15px', outline: 'none',
        boxSizing: 'border-box',
    });

    const pwInputStyle = (key) => ({
        ...inputStyle(key), paddingRight: '44px',
    });

    const FieldError = ({ k }) => fieldErrors[k] ? (
        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <FiAlertCircle size={12} /> {fieldErrors[k]}
        </p>
    ) : null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row', background: 'var(--bg)', position: 'relative' }}>

        {/* Toast */}
        {toast && (
            <div style={{
            position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '14px 20px',
            boxShadow: 'var(--shadow-lg)', fontSize: '14px', fontWeight: '500',
            color: 'var(--text)', animation: 'slideDown 0.2s ease', whiteSpace: 'nowrap',
            }}>
            <style>{`@keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`}</style>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--ok-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiCheckCircle size={15} color="var(--ok)" />
            </div>
            {toast}
            </div>
        )}

        {/* Left panel */}
        <div style={{
            width: isMobile ? '100%' : '42%', minHeight: isMobile ? '180px' : 'auto',
            background: 'var(--accent)', display: 'flex', flexDirection: 'column',
            justifyContent: isMobile ? 'center' : 'flex-end',
            padding: isMobile ? '32px 28px' : '60px',
            position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', marginBottom: isMobile ? '8px' : '24px' }}>
                ✦ FOCUSBOARD
            </div>
            {isMobile ? (
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontFamily: 'Lora, serif', fontStyle: 'italic' }}>
                จัดระเบียบชีวิตให้ง่ายกว่าเดิม
                </p>
            ) : (
                <>
                <h2 style={{ fontFamily: 'Lora, serif', fontSize: '40px', fontWeight: '400', color: '#fff', lineHeight: '1.2', marginBottom: '16px', fontStyle: 'italic' }}>
                    จัดระเบียบ<br />ชีวิตให้ง่าย<br />กว่าเดิม
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7', maxWidth: '280px' }}>
                    ติดตามงาน วางแผน และทำสิ่งสำคัญให้เสร็จทุกวัน
                </p>
                </>
            )}
            </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '32px 24px 48px' : '40px' }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: isMobile ? '26px' : '30px', fontWeight: '400', color: 'var(--text)', marginBottom: '6px' }}>
                {isLogin ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีใหม่'}
            </h1>
            <p style={{ color: 'var(--text3)', fontSize: '14px', marginBottom: '24px' }}>
                {isLogin ? 'กรอกข้อมูลเพื่อเข้าสู่ระบบ' : 'เริ่มต้นฟรี ไม่มีค่าใช้จ่าย'}
            </p>

            {fieldErrors.server && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 'var(--r-sm)', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiAlertCircle size={14} /> {fieldErrors.server}
                </div>
            )}

            <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* ชื่อผู้ใช้ */}
                <div>
                <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>ชื่อผู้ใช้</label>
                <input type="text" placeholder="username" value={username}
                    onChange={e => { setUsername(e.target.value); clearErr('username'); }}
                    style={inputStyle('username')} />
                <FieldError k="username" />
                </div>

                {/* อีเมล (register only) */}
                {!isLogin && (
                <div>
                    <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>อีเมล</label>
                    <input type="email" placeholder="you@example.com" value={email}
                    onChange={e => { setEmail(e.target.value); clearErr('email'); }}
                    style={inputStyle('email')} />
                    <FieldError k="email" />
                </div>
                )}

                {/* รหัสผ่าน */}
                <div>
                <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>รหัสผ่าน</label>
                <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
                    onChange={e => { setPassword(e.target.value); clearErr('password'); }}
                    style={pwInputStyle('password')} />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                </div>
                <FieldError k="password" />
                </div>

                {/* ยืนยันรหัส (register only) */}
                {!isLogin && (
                <div>
                    <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>ยืนยันรหัส</label>
                    <div style={{ position: 'relative' }}>
                    <input type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={confirmPw}
                        onChange={e => { setConfirmPw(e.target.value); clearErr('confirmPw'); }}
                        style={pwInputStyle('confirmPw')} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center', padding: '4px' }}>
                        {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                    </div>
                    <FieldError k="confirmPw" />
                </div>
                )}

                <button type="submit" disabled={loading} style={{
                marginTop: '4px', padding: '14px',
                background: loading ? 'var(--border2)' : 'var(--accent)',
                border: 'none', borderRadius: 'var(--r-sm)', color: '#fff',
                fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? 'กำลังดำเนินการ...' : isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text3)' }}>
                {isLogin ? 'ยังไม่มีบัญชี? ' : 'มีบัญชีอยู่แล้ว? '}
                <button onClick={() => { setIsLogin(!isLogin); setFieldErrors({}); setShowPw(false); setShowConfirm(false); }} style={{
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