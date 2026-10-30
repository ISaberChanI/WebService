import database from "../services/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import multer from "multer"

// upload part
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_mem')
    },
    filename: function (req, file, cb) {
        // 🌟 1. ดึงอีเมลจาก req.user ที่ได้มาจาก verifyToken (ปลอดภัยกว่าใช้ req.body.memEmail)
        const email = req.user?.memEmail || req.body.memEmail
        const filename = `${email}.jpg`
        cb(null, filename)
    }
})

const upload = multer({
    storage: storage,  
}).single('file');    

export async function uploadMember(req, res) {
    console.log("Upload Member Image for email:", req.user?.memEmail)
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: 'File uploaded successfully!' });
    });
}

export async function getMember(req, res) {
    console.log('GET /members/detail is requested.')

    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                message: 'กรุณาเข้าสู่ระบบ',
                login: false
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.SECRET_KEY
        )

        const result = await database.query({
            text: `
                SELECT "memEmail", "memName", "dutyId"
                FROM members
                WHERE "memEmail" = $1
            `,
            values: [decoded.memEmail]
        })

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'ไม่พบข้อมูลสมาชิก',
                login: false
            })
        }

        const member = result.rows[0]

        console.log('ข้อมูลสมาชิกปัจจุบัน:', member)

        return res.status(200).json({
            memEmail: member.memEmail,
            memName: member.memName,
            dutyId: member.dutyId,
            login: true
        })
    } catch (err) {
        console.error('getMember error:', err.message)

        return res.status(401).json({
            message: 'Session หมดอายุหรือไม่ถูกต้อง',
            login: false
        })
    }
}

export async function postMember(req, res) {
    console.log("POST /members is requested");

    const bodyData = req.body;

    try {
        if (!bodyData.memEmail || !bodyData.memName || !bodyData.password) {
            return res.status(400).json({
                message: "กรุณากรอกอีเมล ชื่อ และรหัสผ่าน",
                regist: false
            });
        }

        const chkRow = await database.query({
            text: `SELECT * FROM members WHERE "memEmail" = $1`,
            values: [bodyData.memEmail]
        });

        if (chkRow.rowCount !== 0) {
            return res.status(409).json({
                message: `อีเมล ${bodyData.memEmail} มีอยู่แล้ว`,
                regist: false
            });
        }

        const pwdHash = await bcrypt.hash(bodyData.password, 11);

        await database.query({
            text: `
                INSERT INTO members
                    ("memEmail", "memName", "memHash", "dutyId")
                VALUES ($1, $2, $3, $4)
            `,
            values: [
                bodyData.memEmail,
                bodyData.memName,
                pwdHash,
                "member"
            ]
        });

        return res.status(201).json({
            message: "Regist Success",
            regist: true
        });

    } catch (err) {
        console.error("postMember error:", err);

        return res.status(500).json({
            message: err.message,
            regist: false
        });
    }
}

export async function loginMember(req, res) {
    console.log(`POST /Loginmembers is requested`)
    const bodyData = req.body
    try {
        if (!bodyData.loginName || !bodyData.password) {
            return res.json(
                { message: `Login and Password is required`, login: false }
            )
        }

        const result = await database.query({
            text: `SELECT * FROM members WHERE "memEmail" = $1 `,
            values: [bodyData.loginName]
        })
        if (result.rowCount == 0)
            return res.json({ message: `Login Fail`, login: false })

        const loginOK = await bcrypt.compare(bodyData.password, result.rows[0].memHash)
        
        if (loginOK) {
            const theuser = {
                memEmail: result.rows[0].memEmail,
                memName: result.rows[0].memName,
                dutyId: result.rows[0].dutyId
            }
            const secret_key = process.env.SECRET_KEY
            const token = jwt.sign(theuser, secret_key, { expiresIn: '1h' })
            
            // 🌟 ปรับปรุงการตั้งค่า Cookie ให้ยืดหยุ่นตาม Environment (Localhost ใช้ secure: false ได้)
            res.cookie('token', token, {
                maxAge: 3600000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // ถ้าขึ้น Production ค่อยเป็น true
                sameSite: 'lax' // เปลี่ยนจาก strict เป็น lax เพื่อป้องกันปัญหาการบล็อกคุกกี้ข้ามพอร์ตใน Localhost
            })

            return res.json({
                message: "Login Success",
                login: true,
                dutyId: result.rows[0].dutyId
            });
        }
        else {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            })
            return res.json({ message: "Login Fail", login: false })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function logoutMember(req, res) {
    console.log(`GET /logoutMember is requested.`)
    try {
        // 🌟 ปรับ Options ของ clearCookie ให้ตรงกับตอน res.cookie ทุกประการ
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })
        return res.json({ message: `Logout Success`, login: false })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function getAllMember(req, res) {
    console.log(`GET /members is requested.`)
    try {
        const strQry = `
            SELECT m.*
            FROM members m
            WHERE m."dutyId" = 'member'
        `
        const result = await database.query(strQry)
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}

export async function getSearchMember(req, res) {
    console.log(`GET /members/search = ${req.params.id} is requested.`)
    
    try {
        const result = await database.query({
            text:` 
                SELECT m.*
                FROM members m
                WHERE m."dutyId" = 'member'
                AND (
                    m."memEmail" ILIKE $1 
                    OR m."memName" ILIKE $1
                )
            `,
            values:[`%${req.params.id}%`]
        })
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}

export async function changeMemberStatus(req, res) {
    const { email } = req.body

    console.log(`PUT /members/status for email: ${email}`)

    try {
        if (!email) {
            return res.status(400).json({
                ok: false,
                message: 'กรุณาระบุอีเมลสมาชิก'
            })
        }

        const checkResult = await database.query({
            text: `
                SELECT "memEmail", "dutyId"
                FROM members
                WHERE "memEmail" = $1
            `,
            values: [email]
        })

        if (checkResult.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'ไม่พบข้อมูลสมาชิก'
            })
        }

        const currentDuty = checkResult.rows[0].dutyId

        const newDuty =
            currentDuty?.toLowerCase() === 'admin'
                ? 'member'
                : 'admin'

        const updateResult = await database.query({
            text: `
                UPDATE members
                SET "dutyId" = $1
                WHERE "memEmail" = $2
                RETURNING "memEmail", "dutyId"
            `,
            values: [newDuty, email]
        })

        console.log('สถานะใหม่:', updateResult.rows[0])

        return res.status(200).json({
            ok: true,
            message: 'เปลี่ยนสถานะสำเร็จ',
            member: updateResult.rows[0],
            newDuty: updateResult.rows[0].dutyId
        })
    } catch (err) {
        console.error('changeMemberStatus error:', err)

        return res.status(500).json({
            ok: false,
            message: err.message
        })
    }
}

export async function updateMemberName(req, res) {
    try {
        // 🌟 2. ดึงอีเมลจาก Token (req.user.memEmail) หากไม่มีค่อยไปอ่านจาก req.body (เผื่อกรณีแอดมินแก้ให้คนอื่น)
        const email = req.user?.memEmail || req.body.email
        const { name } = req.body

        if (!email || !name?.trim()) {
            return res.status(400).json({
                ok: false,
                message: 'กรุณาระบุอีเมลและชื่อใหม่'
            })
        }

        const result = await database.query({
            text: `
                UPDATE members
                SET "memName" = $1
                WHERE "memEmail" = $2
                RETURNING "memEmail", "memName"
            `,
            values: [name.trim(), email]
        })

        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'ไม่พบสมาชิก'
            })
        }

        return res.status(200).json({
            ok: true,
            message: 'เปลี่ยนชื่อสำเร็จ',
            member: result.rows[0]
        })
    } catch (err) {
        console.error('updateMemberName error:', err)

        return res.status(500).json({
            ok: false,
            message: 'บันทึกชื่อไม่สำเร็จ'
        })
    }
}