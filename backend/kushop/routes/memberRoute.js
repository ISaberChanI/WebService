import express from "express"
import * as memberC from "../controllers/memberController.js"

const router  = express.Router()

router.get('/members',memberC.getAllMember)
router.get('/members/search/:id',memberC.getSearchMember)
router.get('/members/detail',memberC.getMember)
router.get('/members/logout',memberC.logoutMember)
router.post('/members',memberC.postMember)
router.post('/members/login',memberC.loginMember)
router.post('/members/uploadimg',memberC.uploadMember)

export default router