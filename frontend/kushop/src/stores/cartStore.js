import { defineStore } from "pinia";
import {ref} from "vue"
// สร้าง Composition Function เพื่อสร้าง Store เพื่อเก็บ State ตั้งชื่อว่า cart
export const useCartStore = defineStore( 'cart',()=>{
    // สร้างตัวแปรที่ต้องการสื่อสาร
    const theQty =ref(0)
    const cartId =ref(null)
    // สร้าง Action เพื่อเปลี่ยนแปลงสถานะของตัวแปรนั้นๆ
    const updateQty=()=>{
        theQty.value++
        console.log("QTY++ : "+theQty.value)
    }
    // Action เพิ่อกำหนดค่า CartId
    const setId=(id)=>{
        cartId.value=id
    }
    // ส่งออกState และ Action เพื่อให้ Component อื่นใช้งาน
    return {theQty,cartId,updateQty,setId}
})
