<template>
    <div class="h1 col-md-6 col-sm-12 text-white mb-3">รายชื่อสมาชิก</div>
    
    <form @submit.prevent="searchMember()">
        <div class="row align-items-center mb-4">
            <div class="col-md-4 col-sm-6">
                <input type="text" class="form-control bg-dark text-white border-secondary" v-model="stext" placeholder="ค้นหาสมาชิก...">
            </div>
            <div class="col mt-2 mt-md-0">
                <button class="btn text-white fw-bold" style="background-color: #F97316; border: none;" type="submit">ค้นหา</button>
                <button class="btn btn-secondary mx-2 fw-bold" type="button" @click="allMember()">ALL</button>
            </div>
        </div>
    </form>

    <!-- แสดงรายการสมาชิกในรูปแบบการ์ด -->
    <div class="row">
        <div v-for="(mem, index) in members" :key="index" class="col-lg-4 col-md-6 col-sm-12 mt-3">
            <div class="card shadow-lg" style="width: 18rem; background-color: #1E293B; border: 1px solid #334155;">
                
                <!-- 🌟 ใช้ @error เพื่อดักจับกรณีที่รูปของสมาชิกคนนั้นไม่มีอยู่จริง (โหลดไม่ขึ้น) แล้วสลับไปใช้รูป default แทน -->
                <img :src="`http://localhost:3000/img_mem/${mem.memEmail}.jpg`" 
                     @error="$event.target.src = 'http://localhost:3000/img_mem/default.jpg'"
                     class="card-img-top p-2 rounded" 
                     :alt="`${mem.memName}`" 
                     style="height: 200px; object-fit: cover;">

                <div class="card-body">
                    <h5 class="card-title text-white fw-bold">{{ mem.memName }}</h5>
                    <p class="card-text text-secondary">
                        อีเมล: {{ mem.memEmail }} <br>
                        สิทธิ์: <span style="color: #F97316;" class="fw-bold">{{ mem.dutyId && mem.dutyId.toLowerCase() === 'admin' ? 'Admin' : 'Member' }}</span>
                    </p>
                    
                    <router-link :to="{ path: '/members/detail', query: { email: mem.memEmail } }" style="text-decoration: none;">
                        <div class="btn text-white fw-bold w-100" style="background-color: #F97316; border: none;">ดูรายละเอียด</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue'
    import { useRoute } from 'vue-router' // 1. Import useRoute เพิ่ม
    import axios from 'axios'

    const route = useRoute() // 2. ประกาศใช้งาน route
    const members = ref([])
    const stext = ref("")

    // แยกฟังก์ชันโหลดข้อมูลออกมาเพื่อให้เรียกใช้ซ้ำได้ง่าย
    const loadMembers = async () => {
        await axios.get(`http://localhost:3000/members`)
            .then(res => { members.value = res.data })
            .catch(err => console.log(err.message))
    }

    // โหลดข้อมูลสมาชิกทั้งหมดเมื่อเข้าหน้าเว็บครั้งแรก
    onMounted(async () => {
        await loadMembers()
    })

    // 🌟 3. เติม watch ตรงนี้ เพื่อดักฟังการเปลี่ยน URL/Path
    watch(() => route.path, async (newPath) => {
        // ถ้าเปลี่ยนกลับมาหน้า memberlist ให้โหลดข้อมูลใหม่ทันที
        if (newPath === '/memberlist') {
            await loadMembers()
        }
    })

    // ฟังก์ชันค้นหาสมาชิก
    const searchMember = async () => {
        await axios.get(`http://localhost:3000/members/search/${stext.value}`)
            .then(res => { members.value = res.data })
            .catch(err => console.log(err.message))
    }

    // ฟังก์ชันแสดงสมาชิกทั้งหมด (ปุ่ม ALL)
    const allMember = async () => {
        await axios.get(`http://localhost:3000/members/`)
            .then(res => { members.value = res.data })
            .catch(err => console.log(err.message))
    }

    const chkImage=async()=>{
    const image = new Image(); // สร้าง Object Image
    // กำหนด attribute src ให้ Image เพื่อลองตรวจสอบดูว่ามีรูปนี้หรือเปล่า
    image.src = `http://localhost:3000/img_mem/${memEmail.value}.jpg`;
    image.onload = () => {
        // รูปภาพโหลดสำเร็จ
        imgOK.value = true;
    };
    image.onerror = () => {
        // รูปภาพไม่สามารถโหลดได้
        imgOK.value = false;
    };

        const searchMember = async ()=>{
        await axios.get(`http://localhost:3000/members/search/${stext.value}`)
        .then(res=>{products.value=res.data})
        .catch(err=>console.log(err.message))
    }

}
    
</script>

<style lang="scss" scoped>

</style>