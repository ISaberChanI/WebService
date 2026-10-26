<template>
    <div class="container">
        <div v-for="(pd, pdId) in products" :key="pdId" class="mt-5">
            <div class="row ">
                <div class="col-md-6 col-sm-12 ">
                   <div
    class="card mx-auto mb-3"
    style="width: 18rem; height: 280px; background-color: #1E293B; border: 1px solid #334155;"
>
    <img
        :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
        alt=""
        class="rounded shadow-sm"
        style="width: 100%; height: 100%; object-fit: contain; padding: 10px;"
    >
</div>
                </div>
                <div class="col-md-6 col-sm-12 ">
                    <table class="table table-dark table-borderless" style="background-color: transparent;">
                        <tbody>
                            <tr>
                                <td><h4>{{ pd.pdId }}</h4></td> <td><h4>{{ pd.pdName }}</h4></td>
                            </tr>
                            <tr>
                                <td><h5>ราคา</h5></td> <td><h5>{{ pd.pdPrice }}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>ยี่ห้อ</h5></td> <td><h5>{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}</h5></td>
                            </tr>
                           <tr>
                                <td><h5>รายละเอียด</h5></td> <td><h5>{{ pd.pdRemark }}</h5></td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- สร้างปุ่มเพื่อทำการนำสินค้าลงตะกร้า เรียก function chkLogin -->
                    <button class="btn btn-primary" @click="chkLogin()">
                        <i class="bi bi-cart lead"></i> ใส่ตะกร้า&nbsp;
                    </button>
                   <button
    v-if="authStore.isAdmin"
    class="btn btn-warning float-end"
    @click="editProduct(pd.pdId)"
>
    <i class="bi bi-pencil-fill lead"></i>
    แก้ไข
</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
    import { onMounted, ref } from 'vue'; // import function ref มาจาก vue
    import { useRoute,useRouter } from 'vue-router' //useRoute มีไว้เพื่อ อ่าน ข้อมูล useRouter มีไว้เพื่อ สั่งการ ให้เปลี่ยนComponent
    import { useCartStore } from '@/stores/cartStore';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/authStore';
    axios.defaults.withCredentials = true

    const authStore = useAuthStore();
    const cartStore = useCartStore()
    const route = useRoute()
    const products=ref([]) //array เก็บข้อมูลสินค้าที่ได้รับกลับมาจาก Backend
    const id=ref(null) // รหัสสินค้าที่ส่งมาจาก Router และส่งต่อไป Backend
    const login = ref(false)
    const memEmail=ref(null)
    const cartId=ref(null)
    const backendMessage=ref(null)

const router = useRouter()

<<<<<<< HEAD
    // ฟังก์ชันดึงสินค้าตาม Brand ID
    const getProductsByBrand = async (brandId) => {
        try {
            // ⚠️ ต้องมี s ที่ /products/brands/
            const res = await axios.get(`http://localhost:3000/products/brands/${brandId}`);
            products.value = res.data;
            console.log("รายการสินค้าตามแบรนด์:", products.value);
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err.message);
        }
    };


=======
const editProduct = (pdId) => {
    router.push({
        name: 'ProductEdit',
        params: { pdId: pdId }
    })
}
>>>>>>> 37d7a53672eb39d97d3143427a2bdaf3f4b7ecad
    // เริ่มทำงานเมื่อเกิดการ mount Component
    onMounted(async ()=>{
        id.value= route.params.pdId
        // ระบุ id ของสินค้าที่ต้องการ
        // ระบุ Request ไปที่ Backend ตามที่ Backend กำหนด
        axios.get(`http://localhost:3000/products/${id.value}`)
        .then(res => {
            products.value = res.data;
        })
        .catch(err=>console.log(err.message))
    })

    const chkLogin=async ()=>{
        await axios.get(`http://localhost:3000/members/detail`)
        .then((res)=>{
            login.value=res.data.login
            memEmail.value=res.data.memEmail
        })
        .catch(err=>console.log(err.message)) //ถ้าผิดพลาดแสดง err


        if(login.value){
            console.log("Login:"+login.value)
            await chkCart() //ถ้า Login แล้วจะให้ไปตรวจสอบตะกร้า
            if (!cartId.value) {
                await addCart()
            }
            await addCartDtl()
        }
        else{
            alert("ยังไม่ได้ Login ต้อง Login ก่อนซื้อสินค้า")
        }
    }

    const chkCart=async ()=>{
        console.log('chkCart')
        let members={ // กำหนดค่า
            memEmail:memEmail.value
            }
        try { // Request POST Method
                const response = await axios.post(`http://localhost:3000/carts/chkcart`,members)
                cartId.value=response.data.cartId  
                console.log( cartId.value)            
        }
        catch(err){console.log(err)}                
    }

    const addCart=async ()=>{
        console.log("addCart")
        let customer={ //1.สร้างชุดข้อมูลส่งไปให้ Backend POST
            cusId:memEmail.value
        }
        try{ //2.ส่ง Method Request POST
            const response =await axios.post(
            `http://localhost:3000/carts/addcart`,customer
            )
            // 3.รับค่า Response จาก Backend เพื่อแสดงผล
            backendMessage.value = response.data.messageAddCart;
            cartId.value=response.data.messageAddCart
            console.log( response.data)
        }
        catch(err){
            console.log(err)
        }
    }

    const addCartDtl=async ()=>{
        console.log("addCartDtl")
        let cartdtl={ //1.สร้างชุดข้อมูลส่งไปให้ Backend POST
            cartId:cartId.value,
            pdId:id.value,
            pdPrice:products.value[0].pdPrice
        }
        console.log(cartdtl)
        try{ //2.ส่ง Method Request POST
            const response =await axios.post(
            `http://localhost:3000/carts/addcartdtl`,cartdtl
            )
            cartStore.updateQty()
            cartStore.setId(cartId.value)
            // 3.รับค่า Response จาก Backend เพื่ีอแสดงผล
            backendMessage.value = response.data.messageAddCartDtl;
            console.log( response.data)
        }
        catch(err){
            console.log(err)
        }
    }




</script>


<style lang="scss" scoped>

</style>