

<template>
  <div class="row mt-4">
    <!-- ฝั่งซ้าย: ข้อมูลสมาชิก -->
    <div class="col-md-6 col-sm-12 text-end">
      <h3 class="mt-5 text-white">{{ memEmail }}</h3>
      <h5 class="text-white-50">{{ memName }}</h5>
    </div>

    <!-- ฝั่งขวา: รูปภาพ + อัปโหลด + แก้ไขชื่อ -->
    <div class="col-md-6 col-sm-12 d-flex flex-column align-items-center align-items-md-start">
      
      <!-- รูปโปรไฟล์ -->
      <div class="card" style="width: 18rem;">
        <img
          v-if="imgOK"
          :src="`http://localhost:3000/img_mem/${memEmail}.jpg?timestamp=${imageTimestamp}`"
          :alt="memEmail"
          class="img-fluid rounded"
        />
        <img
          v-else
          src="http://localhost:3000/img_mem/default.jpg"
          :alt="memEmail"
          class="img-fluid rounded"
        />
      </div>

      <!-- ฟอร์ม Upload รูป -->
      <form @submit.prevent="uploadFile" class="mt-3" style="width: 18rem;">
        <div class="d-flex gap-2">
          <input
            class="form-control"
            type="file"
            id="formFile"
            accept="image/*"
            @change="onFileChange"
            required
          />
          <button class="btn btn-primary" type="submit">
            Upload
          </button>
        </div>

        <!-- Alert แจ้งผลการอัปโหลด -->
        <div
          v-if="fileMessage"
          class="alert mt-2 mb-0"
          :class="fileMessage === 'Upload ไม่สำเร็จ' ? 'alert-danger' : 'alert-success'"
        >
          {{ fileMessage }}
        </div>
      </form>

      <!-- ส่วนแก้ไขชื่อ -->
      <div class="mt-3" style="width: 18rem;">
        <!-- ปุ่มแก้ไขชื่อ -->
        <button
          v-if="!editingName"
          class="btn btn-warning w-100"
          type="button"
          @click="startEditName"
        >
          แก้ไขชื่อ
        </button>

        <!-- ช่องกรอกชื่อใหม่ -->
        <form
          v-if="editingName"
          @submit.prevent="saveMemberName"
        >
          <input
            type="text"
            class="form-control mb-2"
            v-model="newName"
            placeholder="กรอกชื่อใหม่"
            required
            maxlength="100"
          />

          <div class="d-flex gap-2">
            <button
              type="submit"
              class="btn btn-success flex-fill"
              :disabled="savingName"
            >
              {{ savingName ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
            <button
              type="button"
              class="btn btn-secondary flex-fill"
              @click="cancelEditName"
            >
              ยกเลิก
            </button>
          </div>
        </form>

        <!-- ข้อความแจ้งผลการแก้ชื่อ -->
        <div
          v-if="nameMessage"
          class="alert mt-2 mb-0"
          :class="nameSuccess ? 'alert-success' : 'alert-danger'"
        >
          {{ nameMessage }}
        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true

const member = ref(null)
const memEmail = ref(null)
const memName = ref(null)
const dutyId = ref(null)
const login = ref(false)

const imgOK = ref(false)
const fileMessage = ref(null)
const file = ref(null)
const imageTimestamp = ref(Date.now())

// ตัวแปรสำหรับแก้ไขชื่อ
const editingName = ref(false)
const newName = ref('')
const savingName = ref(false)
const nameMessage = ref(null)
const nameSuccess = ref(false)

onMounted(async () => {
    await getMember()
    await chkImage()
})

// โหลดข้อมูลสมาชิก
const getMember = async () => {
    try {
        const res = await axios.get(
            'http://localhost:3000/members/detail'
        )

        member.value = res.data
        memEmail.value = res.data.memEmail
        memName.value = res.data.memName
        dutyId.value = res.data.dutyId
        login.value = res.data.login
    } catch (err) {
        console.error(err)
    }
}

// เริ่มแก้ไขชื่อ
const startEditName = () => {
    newName.value = memName.value || ''
    nameMessage.value = null
    editingName.value = true
}

// ยกเลิกการแก้ไข
const cancelEditName = () => {
    editingName.value = false
    newName.value = ''
    nameMessage.value = null
}

// บันทึกชื่อใหม่
const saveMemberName = async () => {
    const trimmedName = newName.value.trim()

    if (!trimmedName) {
        nameSuccess.value = false
        nameMessage.value = 'กรุณากรอกชื่อใหม่'
        return
    }

    if (!memEmail.value) {
        nameSuccess.value = false
        nameMessage.value = 'ไม่พบอีเมลสมาชิก'
        return
    }

    savingName.value = true
    nameMessage.value = null

    try {
        const res = await axios.put(
            'http://localhost:3000/members/name',
            {
                email: memEmail.value,
                name: trimmedName
            }
        )

        if (res.data.ok) {
            memName.value = res.data.member?.memName || trimmedName

            // อัปเดตชื่อที่แสดงในหน้าเว็บ
            if (member.value) {
                member.value.memName = memName.value
            }

            nameSuccess.value = true
            nameMessage.value = 'เปลี่ยนชื่อสำเร็จ'
            editingName.value = false
        } else {
            nameSuccess.value = false
            nameMessage.value =
                res.data.message || 'เปลี่ยนชื่อไม่สำเร็จ'
        }
    } catch (err) {
        console.error(err)
        nameSuccess.value = false
        nameMessage.value =
            err.response?.data?.message || 'ไม่สามารถเปลี่ยนชื่อได้'
    } finally {
        savingName.value = false
    }
}

// อ่านไฟล์รูปภาพ
const onFileChange = (e) => {
    file.value = e.target.files?.[0] || null
}

// Upload รูปภาพ
const uploadFile = async () => {
    if (!file.value) {
        fileMessage.value = 'กรุณาเลือกไฟล์เพื่อ Upload'
        return
    }

    if (!memEmail.value) {
        fileMessage.value = 'ไม่พบอีเมลสมาชิก'
        return
    }

    const formData = new FormData()
    formData.append('memEmail', memEmail.value)
    formData.append('file', file.value)

    try {
        const response = await axios.post(
            'http://localhost:3000/members/uploadImg',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        fileMessage.value =
            response.data.message || 'Upload สำเร็จ'

        await chkImage()
        imageTimestamp.value = Date.now()
    } catch (err) {
        console.error(err)
        fileMessage.value = 'Upload ไม่สำเร็จ'
    }
}

// ตรวจสอบว่ามีรูปสมาชิกหรือไม่
const chkImage = async () => {
    if (!memEmail.value) {
        imgOK.value = false
        return
    }

    const image = new Image()

    image.onload = () => {
        imgOK.value = true
    }

    image.onerror = () => {
        imgOK.value = false
    }

    image.src =
        `http://localhost:3000/img_mem/${memEmail.value}.jpg?timestamp=${imageTimestamp.value}`
}
</script>

<style scoped>
</style>
