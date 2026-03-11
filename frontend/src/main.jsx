import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // ไฟล์ CSS พื้นฐาน (ถ้ามี)
import App from './App.jsx' // ดึง App.jsx ที่เราเพิ่งเขียนมาใช้

// เอา App.jsx ไปแสดงผลใน <div id="root"> ของไฟล์ index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)