import { defineStore } from "pinia";
import { ref, computed } from "vue";

// สร้าง Composition Function เพื่อสร้าง Store เพื่อเก็บ State
export const useAuthStore = defineStore('auth', () => {
    // 1. สร้างตัวแปรเก็บสถานะการเข้าสู่ระบบและสิทธิ์ (admin/member)
    const isLogin = ref(false);
    const dutyId = ref(null);

    // 2. Computed เช็คสิทธิ์ Admin ให้อัตโนมัติ (คืนค่า true/false)
    const isAdmin = computed(() => {
        return isLogin.value && dutyId.value && dutyId.value.toLowerCase() === 'admin';
    });

    // 3. Action รับค่า dutyId ตอนล็อกอินเข้าสู่ระบบ
    const login = (duty) => {
        isLogin.value = true;
        dutyId.value = duty; // เก็บค่าสิทธิ์ เช่น 'admin' หรือ 'member'
        console.log('Status:', isLogin.value, 'Duty:', dutyId.value);
    };

    const logout = () => {
        isLogin.value = false;
        dutyId.value = null; // ล้างค่าสิทธิ์เมื่อ logout
        console.log('Status:', isLogin.value);
    };

    // ส่งออก State, Computed และ Action เพื่อให้ Component อื่นใช้งาน
    return { isLogin, dutyId, isAdmin, login, logout };
});