import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import database from "./services/database.js"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import productRoute from "./routes/productRoute.js"
import memberRoute from "./routes/memberRoute.js"
import cartRoute from "./routes/cartRoute.js"

// import ส่วนที่ติดตั้งเข้ามาสำหรับ Swagger
import swaggerUI from "swagger-ui-express"
import yaml from "yaml"
import fs from "fs"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000 // 🌟 เพิ่ม Fallback port กันกรณี .env โหลดไม่ทัน

// 🌟 ตั้งค่า CORS อนุญาตให้ส่ง Cookie ข้ามพอร์ตได้
app.use(cors({
    origin: [
        'http://localhost', 'http://127.0.0.1',
        'http://localhost:5173', 'http://127.0.0.1:5173',
        'http://localhost:4173', 'http://127.0.0.1:4173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // สำคัญมากสำหรับการส่งผ่าน Cookie (JWT Token)
}))

// Static Folders สำหรับรูปภาพ
app.use("/img_pd", express.static("img_pd"))
app.use("/img_mem", express.static("img_mem"))

// Middleware พื้นฐาน
app.use(bodyParser.json())
app.use(cookieParser()) // 🌟 ต้องวางไว้ก่อนที่ Router จะใช้งาน

// Routes
app.use(productRoute)
app.use(memberRoute)
app.use(cartRoute)

// Swagger Documentation Config
const swaggerfile = fs.readFileSync('services/swagger.yaml', 'utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

// Root Route (🌟 แก้ไขตัวสะกดจาก reg เป็น req)
app.get('/', (req, res) => {
    console.log(`GET / is requested.`)
    res.status(200).json({
        message: "ok"
    })
})

// Start Server
app.listen(port, () => {
    console.log(`Server is listening on PORT : ${port}`)
})