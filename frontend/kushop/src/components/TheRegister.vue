<template>
    <div class="row d-flex justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-12 ">
            <form @submit.prevent="handleSubmit()">
                <div class="card row mt-5 " style="background-color: #EEFFEE;">
                    <div class="card-body">
                        <h1 class="card-title text-secondary ">ลงทะเบียนสมาชิกใหม่</h1>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="memEmail"
                                autocomplete="off" required placeholder="Email" v-model.trim="memEmail" >
                                <label for="memEmail">Email</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="memName"  
                                autocomplete="off" required placeholder="ชื่อ" v-model="memName">
                                <label for="memName">ชื่อ</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="password"  
                                autocomplete="off" required placeholder="Password"
                          v-model="password">
                                <label for="password">Password</label>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <button class="btn btn-primary float-end" type="submit" >
                            <i class="bi bi-check-lg"></i>&nbsp;ตกลง</button>
                        </div>
                    </div>
                </div>
            </form>
            <!-- ส่วนแสดงสถานะ จากการตอบกลับของ Backend -->
            <p v-if="regist && message" class="alert alert-success mt-3">ลงทะเบียนสำเร็จ {{message}}</p>
            <p v-else-if="!regist && message" class="alert alert-danger mt-3">ลงทะเบียนผิดพลาด  {{message}}</p>
        </div>
    </div>
</template>


<script setup>
    import { ref } from 'vue'; // import function ref มาจาก vue
    import axios from 'axios';


    const memEmail=ref(null)
    const memName=ref(null)
    const password=ref(null)
    const regist=ref(null) //ค่าที่รับจาก Backend
    const message=ref(null) //ค่าที่รับจาก Backend
   
    const handleSubmit =async()=>{
        let members={ // กำหนดค่า
            memEmail:memEmail.value, //ค่าที่ส่งให้ Backend
            memName:memName.value, //ค่าที่ส่งให้ Backend
            password:password.value //ค่าที่ส่งให้ Backend
        }
        try { // Request POST Method
          const response = await axios.post(`http://localhost:3000/members`,members)
          console.log(response.data)
          regist.value=response.data.regist
          message.value=response.data.message
        }
        catch(err){
          console.log(err)
        }
    }
</script>


<style lang="scss" scoped>

</style>