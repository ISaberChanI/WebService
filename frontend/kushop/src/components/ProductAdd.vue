<template>
  <div class="container mt-4" style="max-width: 600px;">
    <div class="card bg-dark text-white border-secondary p-4 shadow">
      <h3 class="mb-4 text-warning fw-bold">
        <i class="bi bi-box-seam-fill me-2"></i>เพิ่มสินค้าใหม่
      </h3>

      <!-- แสดง ข้อความแจ้งเตือน Error -->
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="errorMessage = ''"></button>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- รหัสสินค้า (pdId) -->
        <div class="mb-3">
          <label class="form-label">รหัสสินค้า (pdId) <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control bg-secondary text-white border-0" 
            v-model="product.pdId" 
            placeholder="เช่น 001" 
            required
          >
        </div>

        <!-- ชื่อสินค้า (pdName) -->
        <div class="mb-3">
          <label class="form-label">ชื่อสินค้า (pdName) <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control bg-secondary text-white border-0" 
            v-model="product.pdName" 
            placeholder="ระบุชื่อสินค้า" 
            required
          >
        </div>

        <!-- ราคาสินค้า (pdPrice) -->
        <div class="mb-3">
          <label class="form-label">ราคา (บาท)</label>
          <input 
            type="number" 
            class="form-control bg-secondary text-white border-0" 
            v-model.number="product.pdPrice" 
            placeholder="0.00" 
            min="0"
          >
        </div>

        <!-- รหัสประเภทยี่ห้อ/แบรนด์ (brandId) -->
        <div class="mb-3">
          <label class="form-label">รหัสยี่ห้อ (brandId)</label>
          <input 
            type="text" 
            class="form-control bg-secondary text-white border-0" 
            v-model="product.brandId" 
            placeholder="เช่น B01"
          >
        </div>

        <!-- รหัสประเภทสินค้า (pdTypeId) -->
        <div class="mb-3">
          <label class="form-label">รหัสประเภทสินค้า (pdTypeId)</label>
          <input 
            type="text" 
            class="form-control bg-secondary text-white border-0" 
            v-model="product.pdTypeId" 
            placeholder="เช่น T01"
          >
        </div>

        <!-- 📷 ส่วนเลือกรูปภาพและปุ่มอัปโหลดรูปภาพ -->
        <div class="mb-4">
          <label class="form-label">รูปภาพสินค้า (.jpg)</label>
          <div class="input-group">
            <input 
              type="file" 
              class="form-control bg-secondary text-white border-0" 
              accept="image/*"
              @change="onFileChange"
            >
            <button 
              type="button" 
              class="btn btn-warning fw-bold text-dark" 
              @click="uploadFile"
            >
              <i class="bi bi-upload me-1"></i> อัปโหลดรูป
            </button>
          </div>
          <!-- ข้อความแจ้งเตือนการ Upload -->
          <div v-if="fileMessage" class="mt-2 text-info small fw-bold">
            <i class="bi bi-info-circle me-1"></i>{{ fileMessage }}
          </div>
        </div>

        <!-- ปุ่มกดดำเนินการ -->
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-success w-100 fw-bold">
            บันทึกสินค้า
          </button>
          <button type="button" class="btn btn-outline-light w-50" @click="router.back()">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// ตัวแปรเก็บข้อมูลฟอร์มสินค้า
const product = ref({
  pdId: '',
  pdName: '',
  pdPrice: 0,
  pdTypeId: '',
  brandId: ''
});

const errorMessage = ref('');
const file = ref(null);
const fileMessage = ref('');
const imageTimestamp = ref(Date.now());

// 1. อ่านค่าจาก input file
const onFileChange = (e) => {
  file.value = e.target.files[0];
};

// 2. ฟังก์ชัน Upload รูปภาพสินค้า
const uploadFile = async () => {
  if (!product.value.pdId.trim()) {
    fileMessage.value = "กรุณากรอกรหัสสินค้า (pdId) ก่อนอัปโหลดรูปภาพ";
    return;
  }
  if (!file.value) {
    fileMessage.value = "กรุณาเลือกไฟล์เพื่อ Upload";
    return;
  }

  const formData = new FormData();
  formData.append("pdId", product.value.pdId);
  formData.append("file", file.value);

  try {
    const response = await axios.post("http://localhost:3000/products/uploadImg", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    fileMessage.value = response.data.message || "Upload รูปภาพสำเร็จ";
    imageTimestamp.value = Date.now();
  } catch (err) {
    console.error(err);
    fileMessage.value = "Upload รูปภาพไม่สำเร็จ";
  }
};

// ฟังก์ชันส่งข้อมูลไปยัง API POST /products
const handleSubmit = async () => {
  errorMessage.value = '';

  try {
    const response = await axios.post('http://localhost:3000/products', product.value);
    
    // หากเลือกรูปค้างไว้ จะทำการอัปโหลดให้อัตโนมัติตอนกดบันทึกสินค้าด้วย
    if (file.value && product.value.pdId) {
      await uploadFile();
    }

    if (response.status === 201) {
      alert('เพิ่มสินค้าเรียบร้อยแล้ว');
      router.push('/product');
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 409) {
        errorMessage.value = `รหัสสินค้า "${product.value.pdId}" มีในระบบแล้ว`;
      } else if (err.response.status === 422) {
        errorMessage.value = 'กรุณากรอกรหัสสินค้าและชื่อสินค้าให้ครบถ้วน';
      } else {
        errorMessage.value = err.response.data.message || 'เกิดข้อผิดพลาดในการบันทึก';
      }
    } else {
      errorMessage.value = err.message;
    }
  }
};
</script>