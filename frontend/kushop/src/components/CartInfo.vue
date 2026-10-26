<template>
    <div v-if="qty>0" >
        <button  class="btn btn-success text-white" @click="router.push(`/cartshow/${cartId}`)">
            {{cartId}} [{{ qty }}] - {{ money }}฿
        </button>
    </div>
</template>


<script setup>
    import { onMounted, ref,watch } from 'vue'; // import function ref มาจาก vue
    import axios from 'axios';
    axios.defaults.withCredentials = true


    import { useRouter } from "vue-router" // เพื่อกำหนดให้ใช้ย้ายหน้า
    const router = useRouter();
    import { useCartStore } from '@/stores/cartStore';
    const cartStore = useCartStore()


    const memEmail=ref(null) //ข้อมูลผู้ที่ Login อยู่อ่านจาก Cookie getMember()
    const cartId=ref() //ตะกร้าที่ยังไม่ได้ CF ค่าที่ได้รับจาก chkCart()
    const qty=ref(0) //ค่าที่ได้รับจาก sumCart()
    const money=ref(0) //ค่าที่ได้รับจาก sumCart()
    const id=ref(null) //ค่ารหัสของตะกร้าที่ได้จาก Store เมื่อจำนวนสินค้าเปลี่ยนไป
    // Watch ว่ามีการเปลี่ยนแปลง Qty ใน cartStore หรือไม่
    watch(()=>cartStore.theQty,()=>{
        id.value=cartStore.cartId // ถ้ามีการเปลี่ยนแปลงค่าใน Store ก็ทำการอ่านรหัส Cart
        console.log("Watch Cart:" +id.value)
        sumCart(id.value) // แล้วส่งให้ Backend คำนวนค่าใหม่
    })   
    // เมื่อมีสร้าง component (Refresh Browser) แล้วให้ตรวจสอบใหม่
    onMounted(async ()=>{
        await getMember()
        await chkCart()
        await sumCart(cartId.value)
    })
    // ตรวจสอบตะกร้า
    const chkCart=async ()=>{
        console.log('chkCart')
        let members={ memEmail:memEmail.value }
        console.log(members)
        try { // Request POST Method
                const response = await axios.post(`http://localhost:3000/carts/chkcart`,members)
                console.log( response.data.cartId)            
                cartId.value=response.data.cartId  
        }
        catch(err){console.log(err)}                
    }
    // ตรวจสอบ Member
    const getMember=async ()=>{
        await axios.get(`http://localhost:3000/members/detail`)
            .then((res)=>{
                memEmail.value=res.data.memEmail
            })
            .catch(err=>console.log(err.message))
    }
    // method เพื่อเรียกการคำนวนค่า มีการส่ง parameter cid คือ รหัสตะกร้าที่ส่งมา
    const sumCart=async(cid)=>{
        console.log(`sumCart: ${cid}`)
        await axios.get(`http://localhost:3000/carts/sumcart/${cid}`)
        .then(res => {
            console.log("SumCart: " + res.data.id)
            cartId.value = res.data.id
            qty.value = res.data.qty
            money.value = res.data.money
        })
        .catch(err => { console.error(err);});
    }
</script>


<style lang="scss" scoped>

</style>
