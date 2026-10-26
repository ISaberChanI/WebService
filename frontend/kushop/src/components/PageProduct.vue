<template>
    <!-- vue.js form ถ้าไม่กำหนด @submit.prevent จะทำการเปลี่ยนหน้าเมือ submit -->
    <form @submit.prevent="searchProduct()">
        <div class="row align-items-center mb-4">
            <div class="h1 col-md-6 col-sm-12 text-white">ผลิตภัณฑ์ของเรา</div>
            <div class="col-md-4 col-sm-6">
                <input type="text" class="form-control bg-dark text-white border-secondary" v-model="stext" placeholder="ค้นหาสินค้า...">
            </div>
            <div class="col mt-2 mt-md-0">
                <button class="btn text-white fw-bold" style="background-color: #F97316; border: none;" type="submit" @click="searchProduct()">ค้นหา</button>
                <button class="btn btn-secondary mx-2 fw-bold" type="button" @click="allProduct()">ALL</button>
            </div>
        </div>
    </form>

    <div class="row">
        <div v-for="(pd,pdId) in products" :key="pdId" class="col-lg-4 col-md-6 col-sm-12 mt-3">
            <div class="card shadow-lg" style="width: 18rem; background-color: #1E293B; border: 1px solid #334155;">
                <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" class="card-img-top p-2 rounded" :alt="`${pd.pdName}`">
                <div class="card-body">
                    <h5 class="card-title text-white fw-bold">{{ pd.pdName }}</h5>
                    <p class="card-text text-secondary">
                        {{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }} - 
                        <span style="color: #F97316;" class="fw-bold">฿{{ pd.pdPrice }}</span>
                    </p>
                    <router-link :to="{name:'ProductShow',params:{pdId:pd.pdId} }" style="text-decoration: none;">
                        <div class="btn text-white fw-bold w-100" style="background-color: #F97316; border: none;">ดูรายละเอียด</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {onMounted, ref} from 'vue'
    import axios from 'axios'

    const products=ref([])
    const stext=ref("")

    onMounted( async()=>{
        await axios.get(`http://localhost:3000/products`)
        .then(res=>{products.value=res.data})
        .catch(err=>console.log(err.message))
    })

    const searchProduct = async ()=>{
        await axios.get(`http://localhost:3000/products/search/${stext.value}`)
        .then(res=>{products.value=res.data})
        .catch(err=>console.log(err.message))
    }

    const allProduct = async ()=>{
        await axios.get(`http://localhost:3000/products/`)
        .then(res=>{products.value=res.data})
        .catch(err=>console.log(err.message))
    }

</script>

<style lang="scss" scoped>

</style>