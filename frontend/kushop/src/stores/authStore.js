import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const isLogin = ref(false);
    const dutyId = ref(null);
    const memEmail = ref(null); // 👈 1. เพิ่มตัวแปรเก็บ memEmail

    const isAdmin = computed(() => {
        return isLogin.value && dutyId.value && dutyId.value.toLowerCase() === 'admin';
    });

    // 👈 2. ปรับฟังก์ชัน login ให้รับ email เข้ามาด้วย
    const login = (duty, email) => {
        isLogin.value = true;
        dutyId.value = duty;
        memEmail.value = email; 
    };

    const logout = () => {
        isLogin.value = false;
        dutyId.value = null;
        memEmail.value = null;
    };

    return { isLogin, dutyId, memEmail, isAdmin, login, logout };
});