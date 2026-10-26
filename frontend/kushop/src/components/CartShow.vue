<template>
    <!-- Master -->
    <!-- ถ้าค่าที่อยู่ใน Cookie กับ CusId ไม่ตรงกันแสดงว่าไม่ใช้ผู้ซื้อไม่มีสิทธิอ่าน -->
    <div v-if="memEmail==cusId" class="container mt-4">
        <div v-for="(ct, cartId) in cart" :key="cartId" class="mt-4">
            <div class="card shadow-lg text-white" style="background-color: #1E293B; border: 1px solid #334155;">
                <div class="card-body">
                    <h4 class="card-title fw-bold" style="color: #F97316;">คำสั่งซื้อเลขที่ {{ ct.cartId }}</h4>
                    <h5 class="card-subtitle mt-2 text-secondary">
                        สั่งซื้อวันที่ {{ formattedDate(ct.cartDate) }}
                    </h5>
                    <div class="text-end text-light mt-2">
                        จำนวนสินค้า <span class="fw-bold text-white">{{ ct.sqty }}</span> ชิ้น, 
                        ยอดเงิน <span class="fw-bold" style="color: #F97316;">{{ (ct.sprice??0).toLocaleString() }} บาท</span>
                    </div>
<<<<<<< HEAD
                    <hr />
                  <button class="btn btn-danger"
        @click="deleteCart(ct.cartId)">
    <i class="bi-cart-x-fill"></i> ลบตะกร้าสินค้า
</button>

<button class="btn btn-primary float-end"
        @click="confirmOrder(ct.cartId)">
    <i class="bi-currency-dollar"></i> ยืนยันสั่งสินค้า
</button>
=======
                    <hr style="border-color: #334155;" />
                    <!-- ปุ่มลบตะกร้า -->
                    <a class="btn btn-outline-danger fw-bold" onclick="return confirm('ยืนยันลบตะกร้า')">
                        <i class="bi-cart-x-fill"></i> ลบตะกร้าสินค้า
                    </a>
                    <a class="btn text-white fw-bold float-end" style="background-color: #F97316; border: none;" onclick="return confirm('ยืนยันสั่งสินค้า')">
                        <i class="bi-currency-dollar"></i> ยืนยันสั่งสินค้า
                    </a>
>>>>>>> d792dcd303e78961fe9b69ab0d68c3b21c39c308
                </div>
            </div> <!--card-->
        </div> <!---v for  -->
   
        <!-- Detail Table -->
        <table class="table table-dark table-borderless align-middle mt-4" style="background-color: transparent;">
            <thead>
                <tr style="background-color: #1E293B; color: #94A3B8; height: 40px;">
                    <th class="ps-3"></th>
                    <th>รหัสสินค้า</th>
                    <th>สินค้า</th>
                    <th class="text-end">ราคาต่อหน่วย</th>
                    <th class="text-center">จำนวน</th>
                    <th class="text-end">เป็นเงิน</th>
                    <th class="text-center"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ctd, pdId) in cartDtl" :key="pdId" style="height: 40px; border-bottom: 1px solid #1E293B;" class="text-light">
                    <td class="ps-3">{{ ctd.row_number }}</td>
                    <!-- รหัสสินค้าเน้นสีส้ม -->
                    <td style="color: #F97316;" class="fw-bold">{{ ctd.pdId }}</td>
                    <td>{{ ctd.pdName }}</td>
                    <td class="text-end">{{ ctd.price }}</td>
                    <td class="text-center">{{ ctd.qty }}</td>
                    <td class="text-end fw-bold" style="color: #F97316;">{{ ((ctd.price * ctd.qty)??0).toLocaleString() }}</td>
                    <td class="text-center">
                        <i class="bi-x-lg text-danger" role="button"></i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div><!--v-if-->
    <div v-else class="container mt-5">
        <div class="alert alert-danger shadow">คุณไม่มีสิทธิ์ดูรายการนี้</div>
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

</script>


<style lang="scss" scoped>

</style>