<template>
    <!-- Master --><!-- ถ้าค่าที่อยู่ใน Cookie กับ CusId ไม่ตรงกันแสดงว่าไม่ใช้ผู้ซื้อไม่มีสิทธิอ่าน -->
    <!-- memEmail: {{ memEmail }} ,cusId:{{ cusId }} -->
    <div v-if="memEmail==cusId">
    <!-- <div v-if="true"> -->
        <div v-for="(ct, cartId) in cart" :key="cartId" class="mt-5">
            <div class="card bg-light">
                <div class="card-body">
                    <h4 class="card-title text-primary opacity-75">คำสั่งซื้อเลขที่ {{ ct.cartId }}</h4>
                    <h5 class="card-subtitle mt-2 text-muted">
                        สั่งซื้อวันที่ {{ formattedDate(ct.cartDate) }}
                    </h5>
                    <div class="text-danger text-end">
                        จำนวนสินค้า {{ ct.sqty }}ชิ้น, ยอดเงิน {{ (ct.sprice??0).toLocaleString() }} บาท
                    </div>
                    <hr />
                    <a class="btn btn-danger" onclick="return confirm('ยืนยันลบตะกร้า')">
                        <i class="bi-cart-x-fill"></i> ลบตะกร้าสินค้า
                    </a>
                    <a class="btn btn-primary float-end" onclick="return confirm('ยืนยันสั่งสินค้า')">
                        <i class="bi-currency-dollar"></i> ยืนยันสั่งสินค้า
                    </a>
                </div>
            </div> <!--card-->
        </div> <!---v for  -->
   
        <!-- Detail -->
        <table class="table  mt-3 ">
            <thead>
            <tr class="bg-secondary bg-opacity-10">
                <td></td>
                <td>สินค้า</td>
                <td></td>
                <td class="text-end">ราคาต่อหน่วย</td>
                <td class="text-center">จำนวน</td>
                <td class="text-end">เป็นเงิน</td>
                <td></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(ctd, pdId) in cartDtl" :key="pdId">
                <td>{{ ctd.row_number }}</td>
                <td>{{ ctd.pdId }}</td>
                <td>{{ ctd.pdName }}</td>
                <td class="text-end">{{ ctd.price }}</td>
                <td class="text-center">{{ ctd.qty }}</td>
                <td class="text-end">{{ ((ctd.price * ctd.qty)??0).toLocaleString() }}</td>
                <td class="text-center">
                    <i class="bi-x-lg text-danger"></i>
                </td>
            </tr>
            </tbody>
        </table>
    </div><!--v-if-->
    <div v-else>
        <div class="alert alert-danger mt-5">คุณไม่มีสิทธิ์ดูรายการนี้</div>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router' //useRoute มีไว้เพื่อ อ่าน ข้อมูล useRouter มีไว้เพื่อ สั่งการ ให้เปลี่ยนหน้า
import axios from 'axios';
axios.defaults.withCredentials = true


const route = useRoute()
const cart=ref([])//รับข้อมูล Master
const cartDtl=ref([]) //รับข้อมูล Detail


const cartId=ref(null) //ข้อมูลจาก Database
const cusId=ref(null) //ข้อมูลจาก Database


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
    cartId.value = route.params.cartId //อ่านค่า Cart จาก URL ที่ส่งมา
    console.log("CartShow:"+cartId.value)
    await getCart() // อ่านข้อมูลตะกร้า Master
    await getCartDtl() // อ่านรายละเอียดตะกร้า Detail
})


const getCart=async ()=>{
    console.log('Get Cart:'+cartId.value)
    await axios.get(`http://localhost:3000/carts/getcart/${cartId.value}`)
        .then(res => {
            cart.value = res.data
            cusId.value = cart.value[0].cusId // อ่านค่าว่าลูกค้าของเอกสารนี้เป็นใคร
        })
        .catch(err => {  console.error(err); });      
}
const getCartDtl=async ()=>{
    console.log('Get Cart Detail:'+cartId.value)
    await axios.get(`http://localhost:3000/carts/getcartdtl/${cartId.value}`)
        .then(res => {
            cartDtl.value = res.data
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