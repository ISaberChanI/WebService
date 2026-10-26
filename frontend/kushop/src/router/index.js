import { createRouter,createWebHistory } from "vue-router"
import TheProduct from "@/components/TheProduct.vue"
// import TheProduct from "./components/TheProduct.vue"
import TheLogin from "@/components/TheLogin.vue"
import TheHome from "@/components/TheHome.vue"
import TheRegister from "@/components/TheRegister.vue"
import PageMember from "@/components/PageMember.vue"
import ProductShow from "../components/ProductShow.vue"
import CartShow from "@/components/CartShow.vue"
import CartList from "../components/CartList.vue"
import ProductAdd from "@/components/ProductAdd.vue"
const routes = [
    {
        path:'/',
        name:'home',
        component:TheHome
    },
    {
        path:'/product',
        name:'product',
        component:TheProduct
    },
    {
        path:'/login',
        name:'Login',
        component:TheLogin
    },
    {
        path:'/register',
        name:'Register',
        component:TheRegister
    },
    {
        path:'/pagemember',
        name:'Pagemember',
        component:PageMember
    },
    {
        path:'/ProductShow/:pdId',
        name:'ProductShow',
        component:ProductShow
    },
    {
        // กำหนดว่า route นี้รับ parameter ต้องระบุให้ตรงกันด้วย
        path:'/cartShow/:cartId',
        name:'CartShow',
        component:CartShow
    },
    {
        path:'/cartList/',
        name:'CartList',
        component:CartList
    },
    {
        path: '/product/add',
        name: 'ProductAdd',
        component: ProductAdd
  },


]
const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),routes
})
export default router
