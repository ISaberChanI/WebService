<template>
    <div class="container mt-5">
        <h1>ยินดีต้อนรับสู่ร้าน Kizuna Hobbies</h1>
        <div class="row">
            
            <div v-for="(pd,pdId) in products" :key="pdId" class="col-lg-4 col-md-6 col-sm-12 mt-2">
                <!-- card -->
                <div class="card" style="width: 18rem;background-color: #EEE;">
                <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" class="card-img-top p-2" :alt="`${pd.pdName}`">
                    <div class="card-body">
                        <h5 class="card-title">{{ pd.pdName }}</h5>
                        <p class="card-text">{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }} - {{ pd.pdPrice }}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
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