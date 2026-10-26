<template>
    <div v-if="memEmail && memEmail === cusId" class="container mt-4">

        <!-- Cart Master -->
        <div v-for="ct in cart" :key="ct.cartId" class="mt-4">
            <div
                class="card shadow-lg text-white"
                style="background-color: #1E293B; border: 1px solid #334155;"
            >
                <div class="card-body">
                    <h4 class="card-title fw-bold" style="color: #F97316;">
                        คำสั่งซื้อเลขที่ {{ ct.cartId }}
                    </h4>

                    <h5 class="card-subtitle mt-2 text-secondary">
                        สั่งซื้อวันที่ {{ formattedDate(ct.cartDate) }}
                    </h5>

                    <div class="text-end text-light mt-2">
                        จำนวนสินค้า
                        <span class="fw-bold text-white">
                            {{ ct.sqty ?? 0 }}
                        </span>
                        ชิ้น, ยอดเงิน
                        <span class="fw-bold" style="color: #F97316;">
                            {{ Number(ct.sprice ?? 0).toLocaleString() }} บาท
                        </span>
                    </div>

                    <hr />

                    <button
                        class="btn btn-danger"
                        @click="deleteCart(ct.cartId)"
                        :disabled="busy"
                    >
                        <i class="bi bi-cart-x-fill"></i>
                        ลบตะกร้าสินค้า
                    </button>

                    <button
                        v-if="!ct.cartCf"
                        class="btn btn-primary float-end"
                        @click="confirmOrder(ct.cartId)"
                        :disabled="busy"
                    >
                        <i class="bi bi-currency-dollar"></i>
                        ยืนยันสั่งสินค้า
                    </button>

                    <span v-else class="badge bg-success float-end p-2">
                        <i class="bi bi-check-circle-fill"></i>
                        ยืนยันคำสั่งซื้อแล้ว
                    </span>

                    <div class="clearfix"></div>
                </div>
            </div>
        </div>

        <!-- Cart Detail -->
        <table class="table table-dark table-borderless align-middle mt-4">
            <thead>
                <tr style="background-color: #1E293B; color: #94A3B8;">
                    <th class="ps-3"></th>
                    <th>รหัสสินค้า</th>
                    <th>สินค้า</th>
                    <th class="text-end">ราคาต่อหน่วย</th>
                    <th class="text-center">จำนวน</th>
                    <th class="text-end">เป็นเงิน</th>
                    <th class="text-center">จัดการ</th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="ctd in cartDtl"
                    :key="ctd.pdId"
                    class="text-light"
                    style="border-bottom: 1px solid #1E293B;"
                >
                    <td class="ps-3">{{ ctd.row_number }}</td>

                    <td class="fw-bold" style="color: #F97316;">
                        {{ ctd.pdId }}
                    </td>

                    <td>{{ ctd.pdName }}</td>

                    <td class="text-end">
                        {{ Number(ctd.price ?? 0).toLocaleString() }}
                    </td>

                    <td class="text-center">{{ ctd.qty }}</td>

                    <td class="text-end fw-bold" style="color: #F97316;">
                        {{ (Number(ctd.price ?? 0) * Number(ctd.qty ?? 0)).toLocaleString() }}
                    </td>

                    <td class="text-center">
                        <button
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteCartDtl(ctd)"
                            :disabled="busy || isConfirmed"
                            title="ลบสินค้า"
                        >
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </td>
                </tr>

                <tr v-if="cartDtl.length === 0">
                    <td colspan="7" class="text-center text-secondary">
                        ไม่มีสินค้าในตะกร้า
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="container mt-5 text-center">
        กำลังโหลดข้อมูล...
    </div>

    <!-- Unauthorized / Not found -->
    <div v-else class="container mt-5">
        <div class="alert alert-danger shadow">
            คุณไม่มีสิทธิ์ดูรายการนี้ หรือไม่พบตะกร้าสินค้า
        </div>
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



const deleteCart = async (id) => {
    if (!confirm("ยืนยันลบตะกร้าสินค้าใช่หรือไม่?")) {
        return;
    }

    try {
        console.log("Delete Cart:", id);

        const res = await axios.delete(
            `http://localhost:3000/deletecart/${id}`
        );

        if (res.data.deleteOK) {
            alert("ลบตะกร้าสินค้าสำเร็จ");

          
            cart.value = [];
            cartDtl.value = [];
        } else {
            alert(res.data.message || "ลบตะกร้าสินค้าไม่สำเร็จ");
        }

    } catch (err) {
        console.error("Delete Cart Error:", err);

        alert(
            err.response?.data?.message ||
            "ลบตะกร้าสินค้าไม่สำเร็จ"
        );
    }
};




const confirmOrder = async (id) => {
    if (!confirm("ยืนยันสั่งสินค้า")) return;

    try {
        const res = await axios.put(
            `http://localhost:3000/confirm/${id}`
        );

        if (res.data.confirmOK) {
            alert("ยืนยันคำสั่งซื้อสำเร็จ");

            cart.value = cart.value.map(ct =>
                String(ct.cartId) === String(id)
                    ? { ...ct, cartCf: true }
                    : ct
            );
        } else {
            alert(res.data.message || "ยืนยันคำสั่งซื้อไม่สำเร็จ");
        }
    } catch (err) {
        console.error("Confirm Order Error:", err);
    }
};



const deleteCartDtl = async (ctd) => {
    if (!confirm('ยืนยันลบสินค้านี้')) {
        return
    }

    try {
        await axios.delete(
            `http://localhost:3000/carts/${cartId.value}/${ctd.pdId}`
        )

        // ลบสินค้าออกจากหน้าจอทันที
        cartDtl.value = cartDtl.value.filter(
            item => item.pdId !== ctd.pdId
        )

        alert('ลบสินค้าเรียบร้อยแล้ว')

    } catch (err) {
        console.error(err)
        alert(err.response?.data?.message || 'ไม่สามารถลบสินค้าได้')
    }
}


</script>


<style lang="scss" scoped>

</style>