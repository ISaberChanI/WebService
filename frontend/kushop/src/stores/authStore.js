import { defineStore } from "pinia";
import {ref} from "vue"
// สร้าง Composition Function เพื่อสร้าง Store เพื่อเก็บ State
export const useAuthStore = defineStore( 'auth',()=>{
    // สร้างตัวแปรที่ต้องการสื่อสาร
    const isLogin =ref(false)
    // สร้าง Action เพื่อเปลี่ยนแปลงสถานะของตัวแปรนั้นๆ
    const login=()=>{
        isLogin.value=true
        console.log(isLogin.value)
    }
    const logout=()=>{
        isLogin.value=false
        console.log(isLogin.value)
    }


    // ส่งออกState และ Action เพื่อให้ Component อื่นใช้งาน
    return {isLogin,login,logout }
})
