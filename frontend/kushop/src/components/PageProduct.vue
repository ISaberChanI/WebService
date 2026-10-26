<template>
    <!-- vue.js form ถ้าไม่กำหนด @submit.prevent จะทำการเปลี่ยนหน้าเมือ submit -->
    <form @submit.prevent="searchProduct()">
        <div class="row">
            <div class="h1 col-md-6 col-sm-12text-danger">ผลิตภัณฑ์ของเรา</div>
            <div class="col-md-4 col-sm-6">
                <input type="text" class="form-control" v-model="stext" >
            </div>
            <div class="col">
                <button class="btn btn-primary" type="submit" @click="searchProduct()">ค้นหา</button>
                <button class="btn btn-secondary mx-2" type="button" @click="allProduct()">ALL</button>
            </div>
        </div>
    </form>



    <div class="row">
        
        <div v-for="(pd,pdId) in products" :key="pdId" class="col-lg-4 col-md-6 col-sm-12 mt-2">
            <!-- card -->
            <div class="card" style="width: 18rem;background-color:#EEE;">
            <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" class="card-img-top p-2" :alt="`${pd.pdName}`">
                <div class="card-body">
                    <h5 class="card-title">{{ pd.pdName }}</h5>
                    <p class="card-text">{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }} - {{ pd.pdPrice }}</p>
                    <router-link :to="{name:'ProductShow',params:{pdId:pd.pdId} }"
                        style="text-decoration: none;">
                      <div  class="btn btn-primary">ดูรายละเอียด</div>
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