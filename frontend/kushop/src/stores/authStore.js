import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(null);

    // 🔓 ฟังก์ชันสำหรับถอดรหัส JWT Token (Decode Payload)
    const parseJwt = (tokenStr) => {
        try {
            const base64Url = tokenStr.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    // 🔄 อ่านข้อมูลสิทธิ์จาก Token ทันทีที่โหลดแอปหรือกดรีเฟรช
    const initAuth = () => {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            logout();
            return;
        }

        const payload = parseJwt(savedToken);

        // ตรวจสอบว่า Token สมบูรณ์และยังไม่หมดอายุ (exp)
        if (payload && payload.exp * 1000 > Date.now()) {
            token.value = savedToken;
            user.value = {
                memEmail: payload.memEmail || payload.email,
                dutyId: payload.dutyId || payload.memdutyId
            };
            // แนบ Token ไปกับ Axios Request ทุกครั้ง
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } else {
            // หาก Token หมดอายุ ให้ทำการ Logout ออกทันที
            logout();
        }
    };

    // 🟢 ตรวจสอบสถานะว่า Login อยู่หรือไม่
    const isLogin = computed(() => !!token.value && !!user.value);

    // 👑 ตรวจสอบว่าเป็น Admin หรือไม่ (ดึงจาก Token)
    const isAdmin = computed(() => {
        const role = user.value?.dutyId || user.value?.memdutyId;
        return isLogin.value && role?.toLowerCase() === 'admin';
    });

    // 🔑 ฟังก์ชัน Login บันทึก Token
    const login = (newToken, userData = null) => {
        token.value = newToken;
        localStorage.setItem('token', newToken);

        // แนบ Header Authorization
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // อ่าน Payload จาก Token ทันที
        const payload = parseJwt(newToken);
        user.value = userData || {
            memEmail: payload?.memEmail || payload?.email,
            dutyId: payload?.dutyId || payload?.memdutyId
        };
    };

    // 🚪 ฟังก์ชัน Logout ลบ Token
    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return { 
        token, 
        user, 
        isLogin, 
        isAdmin, 
        login, 
        logout, 
        initAuth 
    };
});