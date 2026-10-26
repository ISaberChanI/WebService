import express from "express"
import * as memberC from "../controllers/memberController.js"

const router  = express.Router()

router.get('/members/detail',memberC.getMember)
router.get('/members/logout',memberC.logoutMember)
router.post('/members',memberC.postMember)
router.post('/members/login',memberC.loginMember)
router.post('/members/uploadimg',memberC.uploadMember)

export default router