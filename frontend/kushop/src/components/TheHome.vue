<template>
    <div class="container mt-5">
        <h1 class="text-white fw-bold mb-4">ยินดีต้อนรับสู่ร้าน <span style="color: #F97316;">Kizuna Hobbies</span></h1>
        
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
                        <a href="#" class="btn text-white fw-bold w-100" style="background-color: #F97316; border: none;">ดูรายละเอียด</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {onMounted, ref} from 'vue'
    import axios from 'axios'

    const products=ref([])

    onMounted( async()=>{
        // await fetch(`http://localhost:3000/products`)
        // .then(res=>res.json())
        // .then(data=>products.value=data)
        // .catch(err=>console.log(err.message))
        await axios.get(`http://localhost:3000/products/three`)
        .then(res=>{products.value=res.data})
        .catch(err=>console.log(err.message))
    })

</script>

<style lang="scss" scoped>

</style>