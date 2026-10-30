import { createRouter, createWebHistory } from "vue-router"
import axios from "axios"
import TheHome from "@/components/TheHome.vue"
import TheProduct from "@/components/TheProduct.vue"
import TheLogin from "@/components/TheLogin.vue"
import TheRegister from "@/components/TheRegister.vue"
import PageMember from "@/components/PageMember.vue"
import ProductShow from "@/components/ProductShow.vue"
import CartShow from "@/components/CartShow.vue"
import CartList from "@/components/CartList.vue"
import MemberList from "@/components/MemberList.vue"

// ✅ เพิ่ม Import สำหรับการ จัดการสินค้า (Admin)
import ProductAdd from "@/components/ProductAdd.vue"
import ProductEdit from "@/components/ProductEdit.vue"

// ตั้งค่า Axios ให้ส่ง Cookie ไปด้วยเสมอตอนเช็คสิทธิ์
axios.defaults.withCredentials = true

const routes = [
    {
        path: '/',
        name: 'home',
        component: TheHome
    },
    {
        path: '/product',
        name: 'product',
        component: TheProduct
    },
    {
        path: '/login',
        name: 'Login',
        component: TheLogin
    },
    {
        path: '/register',
        name: 'Register',
        component: TheRegister
    },
    {
        path: '/pagemember',
        name: 'Pagemember',
        component: PageMember,
        meta: { requiresAuth: true } // ต้องล็อกอินก่อนถึงจะเข้าหน้าโปรไฟล์ตัวเองได้
    },
    {
        path: '/ProductShow/:pdId',
        name: 'ProductShow',
        component: ProductShow
    },
    {
        path: '/cartShow/:cartId',
        name: 'CartShow',
        component: CartShow,
        meta: { requiresAuth: true }
    },
    {
        path: '/cartList',
        name: 'CartList',
        component: CartList,
        meta: { requiresAuth: true }
    },
    {
        path: '/product/add',
        name: 'ProductAdd',
        component: ProductAdd,
        meta: { requiresAdmin: true } // 🔒 สำหรับ Admin เท่านั้น
    },
    {
        path: '/productedit/:pdId',
        name: 'ProductEdit',
        component: ProductEdit,
        meta: { requiresAdmin: true } // 🔒 สำหรับ Admin เท่านั้น
    },
    {
        path: '/memberlist',
        name: 'MemberList',
        component: MemberList,
        meta: { requiresAdmin: true } // 🔒 สำหรับ Admin เท่านั้น
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// 🌟 Navigation Guard: ดักตรวจสอบสิทธิ์ก่อนเปลี่ยนหน้าทุกครั้ง (รูปแบบใหม่ Vue Router 4)
router.beforeEach(async (to) => {
    // ถ้าหน้านี้ต้องการสิทธิ์ Admin หรือต้องการการล็อกอิน
    if (to.meta.requiresAdmin || to.meta.requiresAuth) {
        try {
            // ยิงไปเช็คสถานะและสิทธิ์กับ Backend ผ่าน Cookie Token
            const res = await axios.get('http://localhost:3000/members/detail')

            if (res.data.login) {
                // ถ้าหน้านี้บังคับ Admin แต่ผู้ใช้เป็นแค่ Member ทั่วไป
                if (to.meta.requiresAdmin && res.data.dutyId?.toLowerCase() !== 'admin') {
                    alert('เฉพาะ Admin เท่านั้นที่สามารถเข้าถึงหน้านี้ได้')
                    return '/' // ดีดกลับหน้าแรก
                }
                // ถ้าผ่านเงื่อนไข อนุญาตให้ผ่านไปได้
                return true
            } else {
                alert('กรุณาเข้าสู่ระบบก่อน')
                return '/login'
            }
        } catch (err) {
            alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่')
            return '/login'
        }
    }
    
    // หน้าสาธารณะทั่วไป (Home, Product, Login, Register) เข้าได้ปกติ
    return true
})

export default router