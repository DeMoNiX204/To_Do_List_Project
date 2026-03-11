function Dashboard({ tasks }) {
  // คำนวณตัวเลขสถิติต่างๆ จาก Props (tasks) ที่รับเข้ามา
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(task => task.status === 'To-Do').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const doneTasks = tasks.filter(task => task.status === 'Done').length;

    return (
        <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
        
        {/* กล่องสรุป: งานทั้งหมด */}
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #007bff' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#555' }}>📋 งานทั้งหมด</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#007bff' }}>{totalTasks}</p>
        </div>

        {/* กล่องสรุป: รอดำเนินการ */}
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #dc3545' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#555' }}>⏳ รอดำเนินการ</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#dc3545' }}>{todoTasks}</p>
        </div>

        {/* กล่องสรุป: กำลังทำ */}
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #ffc107' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#555' }}>🚀 กำลังทำ</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#ffc107' }}>{inProgressTasks}</p>
        </div>

        {/* กล่องสรุป: เสร็จสิ้น */}
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#fff', borderRadius: '8px', textAlign: 'center', borderLeft: '4px solid #28a745' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#555' }}>✅ เสร็จสิ้น</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0', color: '#28a745' }}>{doneTasks}</p>
        </div>

        </div>
    );
}

export default Dashboard;