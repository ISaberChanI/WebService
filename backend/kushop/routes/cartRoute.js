import express from "express"
import * as cartC from "../controllers/cartController.js"
import { verifyToken } from "../middleware/auth.js" // 🌟 1. นำเข้า Middleware ตรวจสอบ Token

const router = express.Router()

// 🌟 2. นำ verifyToken มาใส่ไว้ตรงกลางระหว่าง path กับ controller 
// เพื่อบังคับว่า "ต้องมี Token ที่ถูกต้องเท่านั้นถึงจะเรียกใช้งานเส้นทางนี้ได้"

router.post('/carts/chkcart', verifyToken, cartC.chkCart)
router.post('/carts/addcart', verifyToken, cartC.postCart)
router.post('/carts/addcartdtl', verifyToken, cartC.postCartDtl)
router.get('/carts/sumcart/:id', verifyToken, cartC.sumCart)
router.get('/carts/getcart/:id', verifyToken, cartC.getCart)
router.get('/carts/getcartdtl/:id', verifyToken, cartC.getCartDtl)

// เส้นทางหลักที่หน้า CartList ของลูกค้าเรียกใช้งาน (ดึงตะกร้าตามผู้ใช้ที่ล็อกอิน)
router.post('/carts/getcartbycus', verifyToken, cartC.getCartByCus)

router.delete('/carts/:cartId/:pdId', verifyToken, cartC.delCartDtl)

// ลบตะกร้าทั้งใบ
router.delete("/deletecart/:id", verifyToken, cartC.deleteCart)

// ลบสินค้าในตะกร้าที่เราเลือก
router.delete("/deletecartdtl/:cartId/:pdId", verifyToken, cartC.deleteCartDtl)

// ยืนยันคำสั่งซื้อ
router.put("/confirm/:id", verifyToken, cartC.confirmOrder)

export default router
