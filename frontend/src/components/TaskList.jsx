function TaskList({ tasks, onDelete }) {
  // ดักจับกรณีที่ไม่มีงานเลย ให้แสดงข้อความว่างๆ
    if (tasks.length === 0) {
        return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            🎉 ไม่มีงานค้างอยู่เลย! พักผ่อนได้เต็มที่ครับ
        </div>
        );
    }

    return (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {/* ใช้ .map() เพื่อวนลูปสร้างรายการงานทีละข้อ */}
        {tasks.map((task) => (
            <li 
            key={task.id} 
            style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '20px', 
                marginBottom: '15px',
                backgroundColor: '#fff',
                // เปลี่ยนสีแถบด้านซ้ายตามสถานะของงาน
                borderLeft: `5px solid ${task.status === 'Done' ? '#28a745' : task.status === 'In Progress' ? '#ffc107' : '#dc3545'}`,
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            >
            <div>
                {/* ชื่องาน (ถ้าสถานะเป็น Done จะขีดฆ่าข้อความทิ้ง) */}
                <strong style={{ 
                fontSize: '18px', 
                display: 'block', 
                marginBottom: '10px',
                textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                color: task.status === 'Done' ? '#888' : '#333'
                }}>
                {task.title}
                </strong>
                
                {/* แถบแสดงข้อมูลเพิ่มเติม (Status, Category, Tags) */}
                <div style={{ fontSize: '13px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', color: '#555' }}>
                    📌 {task.status}
                </span>
                <span style={{ backgroundColor: '#e6f7ff', padding: '5px 10px', borderRadius: '15px', color: '#0056b3' }}>
                    📁 {task.category}
                </span>
                {/* ตรวจสอบว่ามี tag ไหม ถ้ามีถึงจะแสดง */}
                {task.tags && task.tags.length > 0 && (
                    <span style={{ backgroundColor: '#f8d7da', padding: '5px 10px', borderRadius: '15px', color: '#721c24' }}>
                    🏷️ {task.tags.join(', ')}
                    </span>
                )}
                </div>
            </div>

            {/* ปุ่มลบ */}
            <button 
                onClick={() => onDelete(task.id)} 
                style={{ 
                padding: '10px 15px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
                ลบ
            </button>
            </li>
        ))}
        </ul>
    );
}

export default TaskList;