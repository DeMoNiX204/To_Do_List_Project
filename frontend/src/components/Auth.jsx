import { useState } from 'react';

function Auth({ onLoginSuccess }) {
  // State สำหรับสลับหน้า Login / Register
    const [isLogin, setIsLogin] = useState(true); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // เคลียร์ Error ก่อนยิง API

        // เลือก API ว่าจะไปที่ login หรือ register
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
        const res = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }

        if (isLogin) {
            // ถ้า Login สำเร็จ ให้เก็บ Token ลงใน Browser และแจ้ง App.jsx
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            onLoginSuccess(data.token, data.user.username);
        } else {
            // ถ้า Register สำเร็จ ให้สลับกลับมาหน้า Login
            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            setIsLogin(true);
            setPassword('');
        }

        } catch (err) {
        setErrorMsg(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {isLogin ? '🔐 เข้าสู่ระบบ' : '📝 สมัครสมาชิก'}
        </h2>
        
        {/* แสดงข้อความ Error สีแดงถ้ามีปัญหา */}
        {errorMsg && <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
            type="text" 
            placeholder="ชื่อผู้ใช้ (Username)" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <input 
            type="password" 
            placeholder="รหัสผ่าน (Password)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <button type="submit" style={{ padding: '12px', backgroundColor: isLogin ? '#007bff' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
            >
            {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? สมัครสมาชิกที่นี่' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่'}
            </button>
        </div>
        </div>
    );
}

export default Auth;