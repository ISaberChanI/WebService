<template>
  <nav class="navbar navbar-expand-lg navbar-dark " style="background-color: #111827">
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
          <li class="nav-item" >
            <router-link to="/" style="text-decoration-line: none;"><div class="nav-link " >Home</div></router-link>
          </li>
          <li class="nav-item">
            <router-link to="/product" style="text-decoration-line: none;"><div class="nav-link">Product</div></router-link>
          </li>
          <li class="nav-item" v-if="login">
            <router-link to="/pagemember" style="text-decoration: none">
              <div class="nav-link fw-bold">{{ memName }}</div>
            </router-link>
          </li>
          <li class="nav-item  pe-3"  v-if="login">
            <CartInfo />
          </li>
          <li class="nav-item " v-if="login">
                        <router-link to="/cartlist" style="text-decoration: none;">
                            <div class="nav-link fw-bold">Cart</div>
                        </router-link>
                    </li>
          <li class="nav-item" v-if="login">
            <a href="#" @click="memLogout()" style="text-decoration: none">
              <div class="nav-link fw-bold">ลงชื่อออก</div>
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
watch(
  () => authStore.isLogin, () => {
    console.log("Watch");
    getMember();
  }
);

onMounted(async () => {
  await getMember();
});


const getMember = async () => {
  await axios
    .get(`http://localhost:3000/members/detail`)
    .then((res) => {
      member.value = res.data;
      memEmail.value = member.value.memEmail;
      memName.value = member.value.memName;
      dutyId.value = member.value.dutyId;
      login.value = member.value.login
    })
    .catch((err) => console.log(err.message)); //ถ้าผิดพลาดแสดง err
};

const memLogout = async () => {
  const cf = window.confirm("ต้องการออกจากระบบ?");
  if (cf) {
    try {
      console.log(authStore.isLogin)
      const response = await axios.get(`http://localhost:3000/members/logout`);
      getMember();
      authStore.logout();
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }
};

</script>


<style>
</style>
