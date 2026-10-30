import jwt from "jsonwebtoken"

export function verifyToken(req, res, next) {
    console.log("Verify Token Middleware is requested.")

    try {
        // 1. ดึง Token จาก Cookie ที่ส่งมากับ Request
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน"
            })
        }

        // 2. ตรวจสอบความถูกต้องของ Token โดยใช้ Secret Key
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        // 3. แนบข้อมูลผู้ใช้ (เช่น memEmail, dutyId) ไปกับ Request เพื่อให้ Controller นำไปใช้ต่อได้
        req.user = decoded

        // 4. ถ้าทุกอย่างถูกต้อง ให้ผ่านไปทำงานที่ Controller หลักต่อ
        next()
    } catch (err) {
        console.error("Token verification error:", err.message)

        return res.status(403).json({
            ok: false,
            message: "Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่"
        })
    }
}

// 🌟 (แถม) Middleware สำหรับเช็คว่าเป็น Admin หรือไม่ (เผื่อใช้กับหน้า MemberList หรือการเปลี่ยนสถานะ)
export function verifyAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user && req.user.dutyId && req.user.dutyId.toLowerCase() === 'admin') {
            next() // เป็น admin ผ่านไปได้
        } else {
            return res.status(403).json({
                ok: false,
                message: "Access Denied: สำหรับผู้ดูแลระบบเท่านั้น"
            })
        }
    })
}