<template>
    <div class="container mt-5">
        <h1 class="text-white fw-bold mb-4">{{ memEmail }}</h1>
        
        <table class="table table-dark table-borderless align-middle" style="background-color: transparent;">
            <thead>
                <tr style="background-color: #1E293B; color: #94A3B8; height: 40px;">
                    <th class="ps-3"></th>
                    <th>เลขที่</th>
                    <th>วันที่</th>
                    <th class="text-center">จำนวน</th>
                    <th class="text-end">ยอดเงิน</th>
                    <th class="text-center">CF</th>
                    <th class="text-center"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ct, cartId) in cart" :key="cartId" style="height: 40px; border-bottom: 1px solid #1E293B;" class="text-light">
                    <td class="ps-3">{{ ct.row_number }}</td>
                    <td>
                        <span>
                            <router-link :to="`/cartshow/${ct.cartId }`" style="text-decoration: none; color: #F97316;" class="fw-bold">
                                {{ ct.cartId }}
                            </router-link>
                        </span>
                    </td>
                    <td>{{ formattedDate(ct.cartDate) }}</td>
                    <td class="text-center">{{ (ct.sqty??0) }}</td>
                    <td class="text-end fw-bold" style="color: #F97316;">{{ (ct.sprice??0).toLocaleString()}}฿</td>
                    <td class="text-center">
                        <i :class="ct.cartCf ? 'bi bi-check-lg text-success fw-bold' : 'bi bi-dash text-secondary'"></i>
                    </td>
                    <td class="text-center">
                        <i class="bi-x-lg text-danger" role="button"></i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
axios.defaults.withCredentials = true


const cart=ref([])//รับข้อมูล Master
const memEmail=ref(null) //ข้อมูลจาก Cookie ที่ Login


const formattedDate=(dateStr)=> {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth()+ 1).padStart(2, '0'); // เดือนเริ่มต้นที่ 0, จึงต้อง +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
onMounted(async ()=>{
    await getMember() // ตรวจสอบผู้ใช้ -->อ่านค่าจาก Cookie
    await getCartList() // อ่านข้อมูลตะกร้าทั้งหมดของผู้ใช้งาน
})


const getCartList=async ()=>{
    let customer ={ id:memEmail.value} // ทำเป็น Object
    console.log(customer)
    await axios.post(`http://localhost:3000/carts/getcartbycus`,customer) // ใช้การ POST
        .then(res => {
            cart.value = res.data
        })
        .catch(err => {  console.error(err); });      
}


const getMember=async ()=>{
    await axios.get(`http://localhost:3000/members/detail`)
        .then((res)=>{
            memEmail.value=res.data.memEmail
        })
        .catch(err=>console.log(err.message))
}
</script>


<style lang="scss" scoped>

</style>