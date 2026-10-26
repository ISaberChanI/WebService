import { createRouter, createWebHistory } from "vue-router"
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
        component: PageMember
    },
    {
        path: '/ProductShow/:pdId',
        name: 'ProductShow',
        component: ProductShow
    },
    {
        path: '/cartShow/:cartId',
        name: 'CartShow',
        component: CartShow
    },
    {
        path: '/cartList',
        name: 'CartList',
        component: CartList
    },
    {
        path: '/product/add',
        name: 'ProductAdd',
        component: ProductAdd
    },
    {
        path: '/productedit/:pdId',
        name: 'ProductEdit',
        component: ProductEdit
    },
    {
        path: '/memberlist/',
        name: 'MembereList',
        component: MemberList
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router