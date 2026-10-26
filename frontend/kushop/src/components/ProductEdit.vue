
<template>
    <div class="container mt-5">
        <div class="card shadow mx-auto" style="max-width: 650px;">
            <div class="card-header bg-warning">
                <h4 class="mb-0">แก้ไขข้อมูลสินค้า</h4>
            </div>

            <div class="card-body">
                <div v-if="loading" class="text-center">
                    กำลังโหลดข้อมูลสินค้า...
                </div>

                <form v-else @submit.prevent="saveProduct">
                    <div class="mb-3">
                        <label class="form-label">รหัสสินค้า</label>
                        <input
                            v-model="product.pdId"
                            class="form-control"
                            readonly
                        >
                    </div>

                    <div class="mb-3">
                        <label class="form-label">ชื่อสินค้า</label>
                        <input
                            v-model="product.pdName"
                            class="form-control"
                            required
                        >
                    </div>

                    <div class="mb-3">
                        <label class="form-label">ราคา</label>
                        <input
                            v-model.number="product.pdPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            class="form-control"
                            required
                        >
                    </div>

                    <div class="mb-3">
                        <label class="form-label">ยี่ห้อ (Brand ID)</label>
                        <input
                            v-model="product.brandId"
                            class="form-control"
                            required
                        >
                    </div>

                    <div class="mb-3">
                        <label class="form-label">ประเภทสินค้า (Type ID)</label>
                        <input
                            v-model="product.pdTypeId"
                            class="form-control"
                            required
                        >
                    </div>

                    <div class="mb-3">
                        <label class="form-label">รายละเอียด</label>
                        <textarea
                            v-model="product.pdRemark"
                            class="form-control"
                            rows="4"
                        ></textarea>
                    </div>

                    <div v-if="errorMessage" class="alert alert-danger">
                        {{ errorMessage }}
                    </div>

                    <button
                        type="submit"
                        class="btn btn-success"
                        :disabled="saving"
                    >
                        {{ saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
                    </button>

                    <button
                        type="button"
                        class="btn btn-secondary ms-2"
                        @click="router.back()"
                    >
                        ยกเลิก
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

axios.defaults.withCredentials = true

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')

const product = ref({
    pdId: '',
    pdName: '',
    pdPrice: 0,
    pdRemark: '',
    brandId: '',
    pdTypeId: ''
})

onMounted(async () => {
    try {
        const res = await axios.get(
            `http://localhost:3000/products/${route.params.pdId}`
        )

        // Backend ของคุณส่ง result.rows ซึ่งเป็น Array
        const data = res.data[0]

        if (!data) {
            errorMessage.value = 'ไม่พบข้อมูลสินค้า'
            return
        }

        product.value = {
            pdId: data.pdId ?? '',
            pdName: data.pdName ?? '',
            pdPrice: Number(data.pdPrice ?? 0),
            pdRemark: data.pdRemark ?? '',
            brandId: data.brandId ?? data.brand?.brandId ?? '',
            pdTypeId: data.pdTypeId ?? data.pdt?.pdTypeId ?? ''
        }
    } catch (err) {
        console.error(err)
        errorMessage.value =
            err.response?.data?.message || 'โหลดข้อมูลสินค้าไม่สำเร็จ'
    } finally {
        loading.value = false
    }
})

const saveProduct = async () => {
    errorMessage.value = ''

    if (!product.value.pdName.trim()) {
        errorMessage.value = 'กรุณากรอกชื่อสินค้า'
        return
    }

    if (
        product.value.pdPrice === '' ||
        !Number.isFinite(Number(product.value.pdPrice)) ||
        Number(product.value.pdPrice) < 0
    ) {
        errorMessage.value = 'กรุณากรอกราคาให้ถูกต้อง'
        return
    }

    saving.value = true

    try {
        const res = await axios.put(
            `http://localhost:3000/products/${route.params.pdId}`,
            {
                pdName: product.value.pdName.trim(),
                pdPrice: Number(product.value.pdPrice),
                pdRemark: product.value.pdRemark,
                pdTypeId: product.value.pdTypeId,
                brandId: product.value.brandId
            }
        )

        if (res.data.message !== 'ok') {
            errorMessage.value = 'Backend ยังยืนยันการบันทึกไม่สำเร็จ'
            return
        }

        alert('แก้ไขข้อมูลสินค้าสำเร็จ')
        router.back()
    } catch (err) {
        console.error(err)
        errorMessage.value =
            err.response?.data?.message || 'บันทึกข้อมูลไม่สำเร็จ'
    } finally {
        saving.value = false
    }
}
</script>
