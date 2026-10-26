<template>
    <!-- แถบค้นหาและปุ่มเพิ่มสินค้า -->
    <form @submit.prevent="searchProduct()">
        <div class="row align-items-center mb-4">
            <div class="h1 col-md-4 col-sm-12 text-white mb-2 mb-md-0">ผลิตภัณฑ์ของเรา</div>
            
            <div class="col-md-4 col-sm-6">
                <input 
                    type="text" 
                    class="form-control bg-dark text-white border-secondary" 
                    v-model="stext" 
                    placeholder="ค้นหาสินค้า..."
                >
            </div>
            
            <div class="col-md-4 col-sm-6 mt-2 mt-sm-0 d-flex align-items-center gap-2">
                <button class="btn text-white fw-bold text-nowrap" style="background-color: #F97316; border: none;" type="submit">
                    ค้นหา
                </button>
                <button class="btn btn-secondary fw-bold" type="button" @click="allProduct()">
                    ALL
                </button>

                <!-- ปุ่มเพิ่มสินค้า (แสดงเฉพาะ Admin) -->
                <button 
                    v-if="authStore.isAdmin" 
                    type="button" 
                    class="btn btn-success fw-bold text-nowrap"
                    @click="router.push('/product/add')"
                >
                    <i class="bi bi-plus-lg"></i> เพิ่มสินค้า
                </button>
            </div>
        </div>
    </form>

    <!-- รายการสินค้า -->
    <div class="row">
        <div v-for="pd in products" :key="pd.pdId" class="col-lg-4 col-md-6 col-sm-12 mt-3">
            <div class="card shadow-lg h-100" style="background-color: #1E293B; border: 1px solid #334155;">
                <img
                    :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
                    class="card-img-top p-2 rounded"
                    :alt="pd.pdName"
                    style="height: 220px; object-fit: contain;"
                >
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-white fw-bold">{{ pd.pdName }}</h5>
                    <p class="card-text text-secondary">
                        {{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }} - 
                        <span style="color: #F97316;" class="fw-bold">฿{{ pd.pdPrice }}</span>
                    </p>
                    
                    <!-- ปุ่มดูรายละเอียด -->
                    <router-link 
                        :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }" 
                        class="btn text-white fw-bold w-100 mt-auto" 
                        style="background-color: #F97316; border: none;"
                    >
                        ดูรายละเอียด
                    </router-link>

                    <!-- ปุ่มแก้ไข/ลบ สินค้า (แสดงเฉพาะ Admin) -->
                    <div v-if="authStore.isAdmin" class="mt-2 d-flex gap-2">
                        <button class="btn btn-sm btn-warning w-50 fw-bold" type="button" @click="editProduct(pd.pdId)">
                            <i class="bi bi-pencil-square"></i> แก้ไข
                        </button>
                        <button class="btn btn-sm btn-danger w-50 fw-bold" type="button" @click="deleteProduct(pd.pdId)">
                            <i class="bi bi-trash-fill"></i> ลบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const products = ref([])
const stext = ref("")
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
    await allProduct()
})

const searchProduct = async () => {
    if (!stext.value.trim()) {
        await allProduct()
        return
    }
    await axios.get(`http://localhost:3000/products/search/${stext.value}`)
        .then(res => { products.value = res.data })
        .catch(err => console.log(err.message))
}

const allProduct = async () => {
    await axios.get(`http://localhost:3000/products`)
        .then(res => { products.value = res.data })
        .catch(err => console.log(err.message))
}

// ฟังก์ชันนำทางไปหน้าแก้ไขสินค้า
const editProduct = (pdId) => {
    router.push(`/productedit/${pdId}`)
}

// ฟังก์ชันลบสินค้า
const deleteProduct = async (pdId) => {
    if (confirm(`คุณต้องการลบสินค้ารหัส ${pdId} ใช่หรือไม่?`)) {
        try {
            const res = await axios.delete(`http://localhost:3000/products/${pdId}`)
            alert(res.data.message || 'ลบสินค้าสำเร็จ')
            await allProduct() // ดึงข้อมูลสินค้าใหม่หลังลบสำเร็จ
        } catch (err) {
            console.error(err.message)
            alert('เกิดข้อผิดพลาดในการลบสินค้า')
        }
    }
}
</script>