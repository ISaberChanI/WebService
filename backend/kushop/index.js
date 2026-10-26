import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
// import pkg from "pg"
import database from "./services/database.js"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import productRoute from "./routes/productRoute.js"
import memberRoute from "./routes/memberRoute.js"
import cartRoute from "./routes/cartRoute.js"

// import ส่วนที่ติดตั้งเข้ามา
import swaggerUI from "swagger-ui-express"
import yaml from "yaml"
// ใช้ File
import fs from "fs"


// const {Pool} =pkg
dotenv.config()

const app=express()
const port=process.env.PORT 

app.use(cors({
    origin:['http://localhost', 'http://127.0.0.1',
            'http://localhost:5173','http://127.0.0.1:5173',
            'http://localhost:4173','http://127.0.0.1:4173'],
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))
app.use("/img_pd",express.static("img_pd"))
app.use("/img_mem",express.static("img_mem"))

app.use(bodyParser.json())

app.use(cookieParser());

app.use(productRoute)
app.use(memberRoute)
app.use(cartRoute)

// swagger กำหนด file config ของตัว swagger
const swaggerfile = fs.readFileSync('services/swagger.yaml','utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
// กำหนด path ที่จะให้เรียกหน้า Document ขึ้นมา
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDoc))


app.get('/',(reg,res)=>{
    console.log(`GET / is requested.`)
    res.status(200).json(
        {
            message:"ok"
        }
    )
})

app.listen(port,()=>{
    console.log(`Server is listen on PORT :${port}`)
})