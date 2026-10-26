<template>
    <div class="row ">
        <div class="col-md-6 col-sm-12 ">
            <h3 class="mt-5 text-end">{{ memEmail }}</h3>
            <h5 class="text-end">{{ memName }}</h5>
        </div>
        <div class="col-md-6 col-sm-12 ">
            <div class="card mt-5" style="width: 18rem" v-if="imgOK" >
                <img :src="`http://localhost:3000/img_mem/${memEmail}.jpg?timestamp=${imageTimestamp}`">
            </div>
            <div class="card mt-5" style="width: 18rem" v-else >
                <img :src="`http://localhost:3000/img_mem/default.jpg`" :alt="memEmail">
            </div>
        </div>

    </div>
    <form @submit.prevent="uploadFile()">
    <div class="row g-3 mt-3">
        <div class="col-md-6 col-sm-12 "></div>
        <div class="col-auto">
            <input class="form-control" type="file" id="formFile" @change="onFileChange" required />
        </div>
        <div class="col-auto">
            <button class="btn btn-primary" type="submit">Upload</button>
        </div>
    </div>
    <div class="row g-3 mt-3">
        <div class="col-md-6 col-sm-12 ">
        </div>
        <div class="col-auto">
        <div class="alert alert-danger" v-if="fileMessage == 'Upload ไม่สำเร็จ' && fileMessage != null">
            {{ fileMessage }}
        </div>
        <div class="alert alert-success" v-if="fileMessage != 'Upload ไม่สำเร็จ' && fileMessage != null">
            {{ fileMessage }}
        </div>
        </div>
        <div class="col-auto"></div>
    </div>
</form>

</template>



<script setup>
import { onMounted,ref } from 'vue';
import axios from 'axios';
axios.defaults.withCredentials =true
const member=ref(null)
const memEmail=ref(null)
const memName=ref(null)
const dutyId=ref(null)
const login=ref(false)
const imgOK=ref(false)
const fileMessage=ref(null)
const file=ref(null)
const imageTimestamp=ref(Date.now())

onMounted(async ()=>{
    await getMember()
    await chkImage()
})
const getMember=async ()=>{
    await axios.get(`http://localhost:3000/members/detail`)
        .then((res)=>{
            member.value=res.data
            memEmail.value=member.value.memEmail
            memName.value=member.value.memName
            dutyId.value=member.value.dutyId
           login.value=member.value.login
        })
        .catch(err=>console.log(err.message)) //ถ้าผิดพลาดแสดง err
}
// อ่านค่าจาก input file เมื่อถูกเรียก
const onFileChange=async(e)=>{
    file.value=e.target.files[0]
}
// ทำการ Uploadfile เมื่อถูกSubmit ต้องเป็น async เพราะต้องรอให้ load เสร็จ
const uploadFile=async()=>{
    if(!file.value){
        fileMessage.value="เลือก File เพื่อ Upload"
        return
    }
    // กำหนดค่า Form เพื่อ POST
    const formData = new FormData()
    formData.append("memEmail",memEmail.value)
    formData.append("file",file.value)
    // กำหนด endpoint และกำหนด Header ว่าเป็นการส่ง file
    // กำหนด Header Message
    try{
        const response=await axios.post("http://localhost:3000/members/uploadImg",formData,{
            headers:{"Content-Type": "multipart/form-data"}
        })
        fileMessage.value=response.data.message
         // ให้ทำการตรวจสอบ image อีกครั้ง
        await chkImage()
        imageTimestamp.value = Date.now()
    }
    catch(err) { fileMessage.value="Upload ไม่สำเร็จ"}
}

const chkImage=async()=>{
    const image = new Image(); // สร้าง Object Image
    // กำหนด attribute src ให้ Image เพื่อลองตรวจสอบดูว่ามีรูปนี้หรือเปล่า
    image.src = `http://localhost:3000/img_mem/${memEmail.value}.jpg`;
    image.onload = () => {
        // รูปภาพโหลดสำเร็จ
        imgOK.value = true;
    };
    image.onerror = () => {
        // รูปภาพไม่สามารถโหลดได้
        imgOK.value = false;
    };
}

</script>



<style scoped>


</style>
