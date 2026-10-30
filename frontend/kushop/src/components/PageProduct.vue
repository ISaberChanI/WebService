<template>
  <div class="container py-4">
    <!-- แถบค้นหาและปุ่มเพิ่มสินค้า -->
    <form @submit.prevent="searchProduct">
      <div class="row align-items-center mb-4 g-3">
        <div class="h1 col-md-4 col-sm-12 text-white m-0 fw-bold">
          ผลิตภัณฑ์ของเรา
        </div>

        <div class="col-md-4 col-sm-6">
          <input
            type="text"
            class="form-control bg-dark text-white border-secondary shadow-sm"
            v-model="stext"
            placeholder="ค้นหาสินค้า..."
          />
        </div>

        <div class="col-md-4 col-sm-6 d-flex align-items-center gap-2">
          <button
            class="btn text-white fw-bold text-nowrap px-3"
            style="background-color: #F97316; border: none;"
            type="submit"
          >
            ค้นหา
          </button>
          <button
            class="btn btn-secondary fw-bold px-3"
            type="button"
            @click="allProduct"
          >
            ALL
          </button>

          <!-- 🌟 ปุ่มเพิ่มสินค้า (เช็กสิทธิ์ Admin โดยตรง) -->
          <button
            v-if="isAdmin"
            type="button"
            class="btn btn-success fw-bold text-nowrap ms-auto"
            @click="router.push('/product/add')"
          >
            <i class="bi bi-plus-lg me-1"></i> เพิ่มสินค้า
          </button>
        </div>
      </div>
    </form>

    <!-- รายการสินค้า -->
    <div class="row g-4">
      <div
        v-for="pd in products"
        :key="pd.pdId"
        class="col-lg-4 col-md-6 col-sm-12"
      >
        <div
          class="card shadow-lg h-100"
          style="background-color: #1E293B; border: 1px solid #334155;"
        >
          <img
            :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
            @error="$event.target.src = 'http://localhost:3000/img_pd/default.jpg'"
            class="card-img-top p-2 rounded"
            :alt="pd.pdName"
            style="height: 220px; object-fit: contain;"
          />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-white fw-bold">{{ pd.pdName }}</h5>
            <p class="card-text text-secondary mb-3">
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

            <!-- 🌟 ปุ่มแก้ไข/ลบ สินค้า (เช็กสิทธิ์ Admin โดยตรง) -->
            <div v-if="isAdmin" class="mt-2 d-flex gap-2">
              <button
                class="btn btn-sm btn-warning w-50 fw-bold"
                type="button"
                @click="editProduct(pd.pdId)"
              >
                <i class="bi bi-pencil-square me-1"></i> แก้ไข
              </button>
              <button
                class="btn btn-sm btn-danger w-50 fw-bold"
                type="button"
                @click="deleteProduct(pd.pdId)"
              >
                <i class="bi bi-trash-fill me-1"></i> ลบ
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- แสดงข้อความเมื่อไม่พบสินค้า -->
      <div v-if="products.length === 0" class="col-12 text-center text-secondary py-5">
        ไม่พบข้อมูลสินค้า
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

axios.defaults.withCredentials = true

const products = ref([])
const stext = ref("")
const dutyId = ref(null) // เก็บสิทธิ์ใช้งานของผู้ใช้ปัจจุบัน
const router = useRouter()

// 🌟 Computed เช็กว่าผู้ใช้ปัจจุบันเป็น Admin หรือไม่
const isAdmin = computed(() => {
  return dutyId.value && dutyId.value.toLowerCase() === 'admin'
})

// 🌟 ดึงข้อมูลสมาชิกที่ Login อยู่จาก Cookie/Session
const getMember = async () => {
  try {
    const res = await axios.get('http://localhost:3000/members/detail')
    if (res.data && res.data.login) {
      dutyId.value = res.data.dutyId
    }
  } catch (err) {
    dutyId.value = null
  }
}

// ดึงรายการสินค้าทั้งหมด
const allProduct = async () => {
  stext.value = ""
  try {
    const res = await axios.get('http://localhost:3000/products')
    products.value = res.data
  } catch (err) {
    console.error(err.message)
  }
}

// ค้นหาสินค้า
const searchProduct = async () => {
  if (!stext.value.trim()) {
    await allProduct()
    return
  }
  try {
    const res = await axios.get(`http://localhost:3000/products/search/${stext.value}`)
    products.value = res.data
  } catch (err) {
    console.error(err.message)
  }
}

// นำทางไปหน้าแก้ไขสินค้า
const editProduct = (pdId) => {
  router.push(`/productedit/${pdId}`)
}

// ลบสินค้า
const deleteProduct = async (pdId) => {
  if (confirm(`คุณต้องการลบสินค้ารหัส ${pdId} ใช่หรือไม่?`)) {
    try {
      const res = await axios.delete(`http://localhost:3000/products/${pdId}`)
      alert(res.data.message || 'ลบสินค้าสำเร็จ')
      await allProduct()
    } catch (err) {
      console.error(err.message)
      alert('เกิดข้อผิดพลาดในการลบสินค้า')
    }
  }
}

onMounted(async () => {
  await getMember()    // เช็กสิทธิ์ Admin จาก Backend ก่อน
  await allProduct()   // ดึงรายการสินค้า
})
</script>

<style scoped>
</style>