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
                    
                    <!-- 🌟 ปุ่มจัดการสมาชิก (เปลี่ยนสถานะ & ดูประวัติการสั่งซื้อ) -->
                    <div class="d-grid gap-2">
                        <!-- ปุ่มเปลี่ยนสถานะ (ผูกกับฟังก์ชันสำหรับกดเปลี่ยนสิทธิ์/สถานะ) -->
                        <button class="btn text-white fw-bold w-100" style="background-color: #F97316; border: none;" @click="changeStatus(mem.memEmail)">
                            เปลี่ยนสถานะ
                        </button>

                        <button
    class="btn btn-primary fw-bold w-100"
    @click="editMemberName(mem)"
>
    แก้ไขชื่อ
</button>

                        <!-- ปุ่มดูประวัติการสั่งซื้อ (ลิงก์ไปยังหน้าประวัติการสั่งซื้อโดยแนบอีเมลไป) -->
                        <router-link :to="{ path: '/cartlist', query: { email: mem.memEmail } }" style="text-decoration: none;">
                            <div class="btn btn-secondary fw-bold w-100">ดูประวัติการสั่งซื้อ</div>
                        </router-link>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import axios from 'axios'

    const route = useRoute()
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

    // ดักฟังการเปลี่ยน URL/Path
    watch(() => route.path, async (newPath) => {
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

    // 🌟 ฟังก์ชันเปลี่ยนสถานะ (Admin <-> Member)
    const changeStatus = async (email) => {
        const cf = window.confirm(`ต้องการเปลี่ยนสถานะของสมาชิก (${email}) ใช่หรือไม่?`)
        if (cf) {
            try {
                const res = await axios.put(`http://localhost:3000/members/status`, { email: email })
                if (res.data.ok) {
                    await loadMembers() // โหลดข้อมูลใหม่เพื่อให้หน้าจออัปเดตสิทธิ์ทันที
                }
            } catch (err) {
                console.log(err.message)
                alert('ไม่สามารถเปลี่ยนสถานะได้')
            }
        }
    }


    // ฟังก์ชันแก้ไขชื่อสมาชิก
const editMemberName = async (mem) => {
    const newName = window.prompt(
        'กรอกชื่อใหม่',
        mem.memName
    )

    // กดยกเลิก หรือไม่ได้กรอกชื่อ
    if (newName === null || newName.trim() === '') {
        return
    }

    try {
        const res = await axios.put(
            'http://localhost:3000/members/name',
            {
                email: mem.memEmail,
                name: newName.trim()
            }
        )

        if (res.data.ok) {
            alert('เปลี่ยนชื่อสำเร็จ')
            await loadMembers()
        } else {
            alert('เปลี่ยนชื่อไม่สำเร็จ')
        }
    } catch (err) {
        console.log(err.message)
        alert('ไม่สามารถเปลี่ยนชื่อได้')
    }
}
</script>

<style lang="scss" scoped>

</style>