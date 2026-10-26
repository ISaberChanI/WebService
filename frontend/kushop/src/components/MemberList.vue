<template>
  <div class="container py-4">
    <!-- หัวข้อหน้าและแถบค้นหา -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <h2 class="text-white fw-bold m-0">
        <i class="bi bi-people-fill text-warning me-2"></i>รายชื่อสมาชิก
      </h2>
      
      <!-- ฟอร์มค้นหาสมาชิก -->
      <form @submit.prevent="searchMember" style="max-width: 450px;" class="w-100">
        <div class="input-group shadow-sm">
          <input 
            type="text" 
            class="form-control bg-dark text-white border-secondary" 
            v-model="stext" 
            placeholder="ค้นหาชื่อ หรือ อีเมลสมาชิก..."
          >
          <button 
            class="btn text-white fw-bold px-3" 
            style="background-color: #F97316; border: none;" 
            type="submit"
          >
            ค้นหา
          </button>
          <button 
            class="btn btn-secondary fw-bold px-3" 
            type="button" 
            @click="allMember"
          >
            ALL
          </button>
        </div>
      </form>
    </div>

    <!-- แสดงรายการสมาชิกในรูปแบบการ์ด -->
    <div class="row g-4">
      <div v-for="(mem, index) in members" :key="index" class="col-lg-4 col-md-6 col-sm-12">
        <div class="card h-100 shadow-lg border-0" style="background-color: #1E293B; border: 1px solid #334155 !important;">
          
          <!-- รูปภาพสมาชิก -->
            <div class="text-center pt-3">
            <img 
                :src="`http://localhost:3000/img_mem/${mem.memEmail}.jpg`" 
                @error="$event.target.src = 'http://localhost:3000/img_mem/default.jpg'"
                class="rounded-circle border border-2 border-secondary shadow-sm" 
                :alt="`${mem.memName}`" 
                style="width: 130px; height: 130px; object-fit: cover;"
            >
            </div>

          <!-- ข้อมูลสมาชิก -->
          <div class="card-body d-flex flex-column p-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title text-white fw-bold m-0 text-truncate" style="max-width: 180px;">
                {{ mem.memName }}
              </h5>
              <!-- ป้าย Badge แสดงสิทธิ์ -->
              <span 
                class="badge px-2 py-1" 
                :class="mem.dutyId && mem.dutyId.toLowerCase() === 'admin' ? 'bg-danger' : 'bg-secondary'"
              >
                {{ mem.dutyId && mem.dutyId.toLowerCase() === 'admin' ? 'Admin' : 'Member' }}
              </span>
            </div>

            <p class="card-text text-secondary small mb-3 text-truncate">
              อีเมล: {{ mem.memEmail }}
            </p>
            
            <!-- ปุ่มจัดการสมาชิก -->
            <div class="mt-auto d-flex flex-column gap-2 pt-3 border-top border-secondary border-opacity-25">
              <!-- แถวปุ่มปฏิบัติการหลัก 2 ปุ่ม -->
              <div class="d-flex gap-2">
                <button 
                  class="btn text-white fw-bold flex-fill btn-sm py-2" 
                  style="background-color: #F97316; border: none;" 
                  @click="changeStatus(mem.memEmail)"
                >
                  เปลี่ยนสถานะ
                </button>
              </div>

              <!-- ปุ่มดูประวัติการสั่งซื้อ -->
              <router-link 
                :to="{ path: '/cartlist', query: { email: mem.memEmail } }" 
                class="text-decoration-none"
              >
                <button class="btn btn-secondary fw-bold w-100 btn-sm py-2">
                  ดูประวัติการสั่งซื้อ
                </button>
              </router-link>
            </div>

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
    if (!stext.value.trim()) {
        await loadMembers()
        return
    }
    await axios.get(`http://localhost:3000/members/search/${stext.value}`)
        .then(res => { members.value = res.data })
        .catch(err => console.log(err.message))
}

// ฟังก์ชันแสดงสมาชิกทั้งหมด (ปุ่ม ALL)
const allMember = async () => {
    stext.value = ""
    await loadMembers()
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

<style scoped>
</style>