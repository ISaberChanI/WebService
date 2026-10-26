import express from "express"
import multer from "multer" // ✅ 1. Import multer
import * as productC from "../controllers/productController.js"

const router = express.Router()

// ✅ 2. ตั้งค่าการจัดเก็บไฟล์รูปภาพด้วย Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './img_pd') // เซฟไว้ในโฟลเดอร์ img_pd
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.pdId}.jpg`) // ตั้งชื่อไฟล์ตาม pdId ที่ส่งมา (เช่น 001.jpg)
  }
})

const upload = multer({ storage: storage })

// Routes สินค้าเดิม
router.get('/products', productC.getAllProduct)
router.get('/products/search/:id', productC.getSearchProduct)
router.get('/products/three', productC.getThreeProduct)
router.get('/products/brands/:id', productC.getProductByBrandId)
router.get('/products/:id', productC.getProductById)

// ✅ 3. เพิ่ม Route สำหรับ Upload รูปภาพสินค้า (ต้องวางไว้ก่อน /products/:id)
router.post('/products/uploadImg', upload.single('file'), (req, res) => {
  return res.status(200).json({ message: 'Upload รูปสินค้าเรียบร้อยแล้ว' })
})

router.post('/products', productC.postProduct)
router.put('/products/:id', productC.putProduct)
router.delete('/products/:id', productC.deleteProduct)

export default router