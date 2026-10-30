import express from "express"
import * as memberC from "../controllers/memberController.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js" // 🌟 1. นำเข้า Middleware

const router  = express.Router()

// 🔒 1. สำหรับ Admin เท่านั้น (จัดการรายชื่อสมาชิก ค้นหา และเปลี่ยนสถานะ)
router.get('/members', verifyAdmin, memberC.getAllMember)
router.get('/members/search/:id', verifyAdmin, memberC.getSearchMember)
router.put('/members/status', verifyAdmin, memberC.changeMemberStatus)

// 🔒 2. สำหรับสมาชิกที่ล็อกอินแล้ว (ดูข้อมูลตัวเอง, อัปโหลดรูป, เปลี่ยนชื่อ, ออกจากระบบ)
router.get('/members/detail', verifyToken, memberC.getMember)
router.get('/members/logout', verifyToken, memberC.logoutMember)
router.post('/members/uploadimg', verifyToken, memberC.uploadMember)
router.put("/members/name", verifyToken, memberC.updateMemberName)

// 🔓 3. สำหรับบุคคลทั่วไป (สมัครสมาชิก และเข้าสู่ระบบ - ไม่ต้องใช้ Token)
router.post('/members', memberC.postMember)
router.post('/members/login', memberC.loginMember)

export default router