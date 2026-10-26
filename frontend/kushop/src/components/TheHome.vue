<template>
    <div class="container mt-5">
        <h1 class="text-white fw-bold mb-4">
            ยินดีต้อนรับสู่ร้าน <span style="color: #F97316;">Kizuna Hobbies</span>
        </h1>

        <!-- Bootstrap Carousel: แสดงและสไลด์สินค้าทีละ 3 รูป -->
        <div id="productCarousel" class="carousel slide pb-5" data-bs-ride="carousel">
            <div class="carousel-inner">
                
                <!-- สไลด์แต่ละรอบ (วนลูปกลุ่มละ 3 รายการ) -->
                <div 
                    v-for="(chunk, rowIndex) in productChunks" 
                    :key="rowIndex" 
                    class="carousel-item"
                    :class="{ active: rowIndex === 0 }"
                >
                    <div class="row">
                        <div 
                            v-for="pd in chunk" 
                            :key="pd.pdId" 
                            class="col-lg-4 col-md-4 col-sm-6 col-12 mt-3"
                        >
                            <!-- h-100: บังคับให้การ์ดทุกใบขยายความสูงเท่ากันทั้งแถว -->
                            <div class="card shadow-lg h-100" style="background-color: #1E293B; border: 1px solid #334155;">
                                
                                <!-- รูปภาพ: ล็อกความสูง 250px และใช้ object-fit: contain เพื่อไม่ให้รูปสัดส่วนเบี้ยว -->
                                <img 
                                    :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" 
                                    class="card-img-top p-2 rounded" 
                                    :alt="`${pd.pdName}`"
                                    style="height: 250px; object-fit: contain; background-color: #0F172A;"
                                >
                                
                                <!-- d-flex flex-column: จัดเลย์เอาต์ข้อความและดันปุ่มลงด้านล่าง -->
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title text-white fw-bold">{{ pd.pdName }}</h5>
                                    <p class="card-text text-secondary">
                                        {{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }} - 
                                        <span style="color: #F97316;" class="fw-bold">฿{{ pd.pdPrice }}</span>
                                    </p>
                                    
                                    <!-- mt-auto: ดันปุ่มดูรายละเอียดให้ลงไปอยู่ชิดขอบล่างสุดเสมอกันทุกกล่อง -->
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- ปุ่มกดเลื่อนสไลด์ ซ้าย-ขวา -->
            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';

const products = ref([]);

// คำนวณตัดแบ่ง Array สินค้าออกเป็นกลุ่ม กลุ่มละ 3 ชิ้นสำหรับแต่ละหน้าสไลด์
const productChunks = computed(() => {
    const chunkSize = 3;
    const chunks = [];
    for (let i = 0; i < products.value.length; i += chunkSize) {
        chunks.push(products.value.slice(i, i + chunkSize));
    }
    return chunks;
});

onMounted(async () => {
    try {
        const res = await axios.get('http://localhost:3000/products');
        products.value = res.data;
    } catch (err) {
        console.error(err.message);
    }
});
</script>

<style scoped>
/* ปรับขนาดและตำแหน่งของปุ่มกดสไลด์ */
.carousel-control-prev,
.carousel-control-next {
    width: 4%;
}
</style>