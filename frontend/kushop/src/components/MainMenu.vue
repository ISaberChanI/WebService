<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #111827">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Kizuna Hobbies</a>
      <button
        class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" style="text-decoration-line: none;"><div class="nav-link">Home</div></router-link>
          </li>
          <li class="nav-item">
            <router-link to="/product" style="text-decoration-line: none;"><div class="nav-link">Product</div></router-link>
          </li>

          <!-- 🌟 แสดงเฉพาะตอนล็อกอิน และ dutyId เป็น admin -->
          <li class="nav-item" v-if="login && dutyId && dutyId.toLowerCase() === 'admin'">
            <router-link to="/memberList" style="text-decoration-line: none;">
              <div class="nav-link" style="font-weight: bold;">MemberList</div>
            </router-link>
          </li>

          <li class="nav-item" v-if="login">
            <router-link to="/pagemember" style="text-decoration: none">
              <div class="nav-link fw-bold">{{ memName }}</div>
            </router-link>
          </li>
          <li class="nav-item pe-3" v-if="login">
            <CartInfo />
          </li>
          <li class="nav-item" v-if="login">
            <router-link to="/cartlist" style="text-decoration: none;">
              <div class="nav-link fw-bold">Cart</div>
            </router-link>
          </li>
          <li class="nav-item" v-if="login">
            <a href="#" @click.prevent="memLogout()" style="text-decoration: none">
              <div class="nav-link fw-bold">Logout</div>
            </a>
          </li>
          <li class="nav-item" v-if="!login">
            <router-link to="/login" style="text-decoration: none">
              <div class="nav-link">Login</div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import CartInfo from './CartInfo.vue'

const router = useRouter()

axios.defaults.withCredentials = true;
const authStore = useAuthStore();
const member = ref(null);
const memEmail = ref(null);
const memName = ref(null);
const dutyId = ref(null);
const login = ref(false)

// 🌟 คอยดักจับการเปลี่ยนแปลงสถานะจาก Pinia Store (เช่น ตอน Login สำเร็จ)
watch(
  () => authStore.isLogin, () => {
    console.log("Auth Store Changed: Fetching member details...");
    getMember();
  }
);

onMounted(async () => {
  await getMember();
});

const getMember = async () => {
  try {
    const res = await axios.get('http://localhost:3000/members/detail');
    member.value = res.data;
    memEmail.value = member.value.memEmail;
    memName.value = member.value.memName;
    dutyId.value = member.value.dutyId;
    login.value = member.value.login;
  } catch (err) {
    // ถ้า Token หมดอายุหรือไม่พบ ให้เคลียร์สถานะเป็น false
    login.value = false;
    memEmail.value = null;
    memName.value = null;
    dutyId.value = null;
    // console.log("Not logged in or session expired.");
  }
};

const memLogout = async () => {
  const cf = window.confirm("ต้องการออกจากระบบ?");

  if (!cf) return;

  try {
    // 1. เรียก API ลบ Cookie ที่ Backend
    await axios.get("http://localhost:3000/members/logout");

    // 2. ล้างสถานะใน Navbar ทันที
    login.value = false;
    member.value = null;
    memEmail.value = null;
    memName.value = null;
    dutyId.value = null;

    // 3. ล้างสถานะใน Auth Store
    authStore.logout();

    // 4. กลับหน้า Home
    await router.push("/");
  } catch (err) {
    console.error(
      "Logout error:",
      err.response?.data || err.message
    );
  }
};
</script>

<style>
</style>