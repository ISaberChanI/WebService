<template>
    <div class="container">
        <div class=" row mt-5">
        <div class="col-sm-12 col-md-6 col-lg-6 mb-5">
            <img src="../assets/Kizuna Hobby.jpg" alt="" width="80%">
        </div>
        <div class="col-sm-12 col-md-6 col-lg-6 mb3">
            <!-- เมื่อสั่ง Submit ให้เรียก Function handleSubmit -->
            <form @submit.prevent="handleSubmit()">
            <div class="col-sm-12 col-md-10 col-lg-8">
                <div class="form-floating mb-3">
                <input class="form-control" type="email" id="loginName" v-model="loginName"
                    autocomplete="off" required autofocus placeholder="loginName">
                <label for="loginName">loginName</label>
                </div>
            </div>
            <div class="col-sm-12  col-md-10 col-lg-8">
                <div class="form-floating mb-3">
                <input class="form-control" type="password" id="password" v-model="password"
                    required placeholder="Password">
                <label for="password">Password</label>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12  col-md-6 mb-3">
                    <router-link to="/register" style="text-decoration: none;">
                        <a href="#" class="btn btn-outline-danger">
                        <i class="bi bi-heart-fill"></i>&nbsp;ลงทะเบียนใหม่</a>
                    </router-link>
                </div>
                <div class="col-sm-12 col-md-6">
                <button class="btn btn-primary " type="submit" style="width: 6rem;">
                    <i class="bi bi-check-lg"></i>&nbsp;ตกลง</button>
                </div>
            </div>
            </form>
        </div>
        </div>
        <!-- ส่วนแสดงสถานะ จากการตอบกลับของ Backend -->
        <p v-if="login && message" class="alert alert-success ">
            เข้าระบบสำเร็จ-{{ message }}</p>
        <p v-else-if="!login && message" class="alert alert-danger">
            เข้าระบบผิดพลาด-{{ message }}</p>
    </div>
</template>




<script setup>
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/authStore';

    axios.defaults.withCredentials = true;

    const authStore = useAuthStore();
    const router = useRouter();
    const loginName = ref(null);
    const password = ref(null);
    const login = ref(null);
    const message = ref(null);

    onMounted(async () => {
        await getMember();
        if (login.value) {
            router.push("/pagemember");
        }
    });

    const getMember = async () => {
        await axios.get(`http://localhost:3000/members/detail`)
            .then((res) => {
                login.value = res.data.login;
                if (res.data.login) {
                    // 👈 ส่ง res.data.memEmail เพิ่มเข้าไป
                    authStore.login(res.data.dutyId, res.data.memEmail); 
                }
            })
            .catch(err => console.log(err.message));
    };

    const handleSubmit = async () => {
        let members = {
            loginName: loginName.value,
            password: password.value
        };
        try {
            const response = await axios.post(`http://localhost:3000/members/login`, members);
            console.log(response.data);
            login.value = response.data.login;
            message.value = response.data.message;

            if (login.value) {
                // 2. ส่งค่า dutyId จาก response ของ Backend เข้า authStore.login()
                authStore.login(response.data.dutyId, loginName.value);// หาก Backend ซ้อนไว้ใน user ให้ใช้ response.data.user.dutyId
                router.push('/pagemember');
            }
        } catch (err) {
            console.log(err);
        }
    };
</script>


<style lang="scss" scoped>

</style>