import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Auth from './components/Auth'; // นำเข้าหน้า Login/Register
import './App.css';

function App() {
  // State สำหรับเก็บข้อมูลงาน
  const [tasks, setTasks] = useState([]);
  
  // State เช็กว่าผู้ใช้มี Token (เข้าสู่ระบบแล้วหรือยัง) โดยดึงจาก localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  // ฟังก์ชันจัดการเมื่อ Login สำเร็จ
  const handleLoginSuccess = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername('');
    setTasks([]); // ล้างข้อมูลงานออกจากหน้าจอ
  };

  // 1. ดึงข้อมูลจาก MongoDB เมื่อเปิดแอป (แนบ Token ไปด้วย)
  useEffect(() => {
    if (!token) return; // ถ้ายังไม่ Login ไม่ต้องดึงข้อมูล

    fetch('http://localhost:5000/api/tasks', {
      headers: { 
        'Authorization': `Bearer ${token}` // แอบส่งบัตรผ่านไปให้ Backend ตรวจ
      } 
    })
      .then(res => res.json())
      .then(data => {
        // เช็กเผื่อกรณี Token หมดอายุหรือไม่ถูกต้อง
        if (data.message) {
          console.error(data.message);
          // ถ้า Token มีปัญหา บังคับให้ออกจากระบบทันที
          if(data.message === 'Token ไม่ถูกต้อง หรือหมดอายุ' || data.message === 'ปฏิเสธการเข้าถึง: ไม่มี Token') {
              handleLogout();
          }
          return;
        }
        // MongoDB ใช้ชื่อ _id เราเลยแปลงให้เป็น id เฉยๆ เพื่อให้ TaskList ใช้งานได้ง่าย
        const formattedTasks = data.map(task => ({ ...task, id: task._id }));
        setTasks(formattedTasks);
      })
      .catch(err => console.error("Error fetching tasks:", err));
  }, [token]);

  // 2. เพิ่มงานใหม่ (แนบ Token ไปด้วย)
  const handleAddTask = async (title) => {
    const newTaskData = { 
      title: title, 
      status: 'To-Do', 
      category: 'General', 
      tags: [] 
    };

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ส่งบัตรผ่าน
        },
        body: JSON.stringify(newTaskData)
      });
      const savedTask = await res.json();
      
      if (res.ok) {
        savedTask.id = savedTask._id; // แปลง _id เป็น id
        setTasks([savedTask, ...tasks]); // อัปเดตหน้าจอโดยเอางานใหม่ขึ้นก่อน
      } else {
        alert(savedTask.message); // แจ้งเตือนถ้ามี Error จาก Backend
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // 3. ลบงาน (แนบ Token ไปด้วย)
  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` // ส่งบัตรผ่าน
        } 
      });
      
      if (res.ok) {
        // อัปเดตหน้าจอโดยเอางานที่ถูกลบออกไป
        setTasks(tasks.filter(task => task.id !== id));
      } else {
         const errorData = await res.json();
         alert(errorData.message);
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // --- ถ้ายังไม่มี Token ให้แสดงหน้า Login ---
  if (!token) {
    return (
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginTop: '50px' }}>📝 ระบบจัดการงาน (To-Do List)</h1>
        <Auth onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // --- ถ้ามี Token แล้ว ให้แสดงแอป To-Do List ปกติ ---
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px', fontFamily: 'sans-serif' }}>
      
      {/* แถบด้านบน แสดงชื่อผู้ใช้ และปุ่มออกจากระบบ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0, color: '#333' }}>👤 ยินดีต้อนรับคุณ, {username}</h2>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ออกจากระบบ
        </button>
      </div>
      
      <Dashboard tasks={tasks} />
      <TaskForm onAddTask={handleAddTask} />
      <TaskList tasks={tasks} onDelete={handleDeleteTask} />
      
    </div>
  )
}

export default App;