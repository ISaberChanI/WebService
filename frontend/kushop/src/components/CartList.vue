
<template>
    <div class="container">
        <h1>{{ memEmail }}</h1>

        <table class="table">
            <thead>
                <tr class="bg-secondary bg-opacity-10" style="height: 30px;">
                    <td></td>
                    <td>เลขที่</td>
                    <td>วันที่</td>
                    <td class="text-center">จำนวน</td>
                    <td class="text-end">ยอดเงิน</td>
                    <td class="text-center">CF</td>
                    <td class="text-center">จัดการ</td>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(ct, cartId) in cart"
                    :key="cartId"
                    style="height: 30px;"
                >
                    <td>{{ ct.row_number }}</td>

                    <td>
                        <router-link
                            :to="`/cartshow/${ct.cartId}`"
                            style="text-decoration: none;"
                        >
                            {{ ct.cartId }}
                        </router-link>
                    </td>

                    <td>{{ formattedDate(ct.cartDate) }}</td>

                    <td class="text-center">
                        {{ ct.sqty ?? 0 }}
                    </td>

                    <td class="text-end">
                        {{ Number(ct.sprice ?? 0).toLocaleString() }}
                    </td>

                    <!-- ปุ่มยืนยัน -->
                    <td class="text-center">
                        <button
                            v-if="!ct.cartCf"
                            class="btn btn-sm btn-success"
                            @click="confirmOrder(ct.cartId)"
                            title="ยืนยันคำสั่งซื้อ"
                        >
                            <i class="bi bi-check-lg"></i>
                        </button>

                        <i
                            v-else
                            class="bi bi-check-circle-fill text-success"
                            title="ยืนยันแล้ว"
                        ></i>
                    </td>

                    <!-- ปุ่มลบ -->
                    <td class="text-center">
                        <button
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteCart(ct.cartId)"
                            title="ลบตะกร้า"
                        >
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </td>
                </tr>

                <tr v-if="cart.length === 0">
                    <td colspan="7" class="text-center text-muted">
                        ไม่พบรายการตะกร้าสินค้า
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

axios.defaults.withCredentials = true;

const cart = ref([]);
const memEmail = ref(null);

const formattedDate = (dateStr) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

onMounted(async () => {
    await getMember();
    await getCartList();
});

const getCartList = async () => {
    try {
        const customer = { id: memEmail.value };

        const res = await axios.post(
            'http://localhost:3000/carts/getcartbycus',
            customer
        );

        cart.value = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error('Get Cart List Error:', err);
    }
};

const getMember = async () => {
    try {
        const res = await axios.get(
            'http://localhost:3000/members/detail'
        );

        memEmail.value = res.data.memEmail;
    } catch (err) {
        console.error('Get Member Error:', err);
    }
};

// ยืนยันคำสั่งซื้อ
const confirmOrder = async (id) => {
    if (!confirm('ยืนยันคำสั่งซื้อใช่หรือไม่?')) return;

    try {
        const res = await axios.put(
            `http://localhost:3000/confirm/${id}`
        );

        if (res.data.confirmOK) {
            alert('ยืนยันคำสั่งซื้อสำเร็จ');
            await getCartList();
        } else {
            alert(res.data.message || 'ยืนยันคำสั่งซื้อไม่สำเร็จ');
        }
    } catch (err) {
        console.error('Confirm Order Error:', err);
        alert(
            err.response?.data?.message ||
            'ยืนยันคำสั่งซื้อไม่สำเร็จ'
        );
    }
};

// ลบตะกร้าทั้งใบ
const deleteCart = async (id) => {
    if (!confirm('ต้องการลบตะกร้าสินค้านี้ใช่หรือไม่?')) return;

    try {
        const res = await axios.delete(
            `http://localhost:3000/deletecart/${id}`
        );

        if (res.data.deleteOK) {
            alert('ลบตะกร้าสำเร็จ');
            await getCartList();
        } else {
            alert(res.data.message || 'ลบตะกร้าไม่สำเร็จ');
        }
    } catch (err) {
        console.error('Delete Cart Error:', err);
        alert(
            err.response?.data?.message ||
            'ลบตะกร้าไม่สำเร็จ'
        );
    }
};
</script>

<style lang="scss" scoped>
</style>
