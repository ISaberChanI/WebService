import express from "express"
import multer from "multer"
import * as productC from "../controllers/productController.js"
import { verifyAdmin } from "../middleware/auth.js" // 🌟 1. นำเข้า Middleware สำหรับเช็คสิทธิ์แอดมิน

const router = express.Router()

// ตั้งค่าการจัดเก็บไฟล์รูปภาพสินค้าด้วย Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './img_pd') // เซฟไว้ในโฟลเดอร์ img_pd
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.pdId}.jpg`) // ตั้งชื่อไฟล์ตาม pdId ที่ส่งมา
  }
})

const upload = multer({ storage: storage })

// 🔓 1. Routes สำหรับลูกค้าทั่วไป (เข้าดูสินค้าได้อิสระ ไม่ต้องใช้ Token)
router.get('/products', productC.getAllProduct)
router.get('/products/search/:id', productC.getSearchProduct)
router.get('/products/three', productC.getThreeProduct)
router.get('/products/brands/:id', productC.getProductByBrandId)
router.get('/products/:id', productC.getProductById)

// 🔒 2. Routes สำหรับ Admin เท่านั้น (เพิ่ม, แก้ไข, ลบสินค้า และอัปโหลดรูป)
router.post('/products/uploadImg', verifyAdmin, upload.single('file'), (req, res) => {
  return res.status(200).json({ message: 'Upload รูปสินค้าเรียบร้อยแล้ว' })
})

router.post('/products', verifyAdmin, productC.postProduct)
router.put('/products/:id', verifyAdmin, productC.putProduct)
router.delete('/products/:id', verifyAdmin, productC.deleteProduct)

export default router