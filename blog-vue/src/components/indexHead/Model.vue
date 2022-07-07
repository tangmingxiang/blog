<script setup>
  import { reactive, ref } from 'vue'

  const dialogFormVisible = ref(false)
  const formLabelWidth = '80px' // 表单 label 标签的宽度

  const form = reactive({
    username: ref(''),
    password: ref(''),
    email: ref('')
  })
</script>

<template>
  <!-- Form -->
  <el-button style="font-size: 20px; padding: 0" text @click="openDialog">{{ modelType === 'login' ? '登录' : '注册' }}</el-button>
  <el-dialog 
    :show-close="false"
    v-model="dialogFormVisible" 
    :title="modelType === 'login' ? '登&nbsp;&nbsp;&nbsp;录' : '注&nbsp;&nbsp;&nbsp;册'" 
    width="500px">
    <el-form :model="form" :rules="rules" ref="modelForm">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username" :rules="{ required: true, message: '请输入用户名' }">
        <el-input v-model="form.username" autocomplete="off" placeholder="请输入用户名" clearable/>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password" :rules="{ required: true, message: '请输入密码' }">
        <el-input v-model="form.password" autocomplete="off" placeholder="请输入密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email" v-if="modelType !== 'login'" :rules="{ required: true, message: '请输入邮箱' }">
        <el-input v-model="form.email" autocomplete="off" placeholder="请输入邮箱" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button :class="'mr'" @click="dialogFormVisible = false" round>取消</el-button>
        <el-button :class="'mr'" @click="resetForm" round>重置</el-button>
        <el-button type="primary" @click="loginOrRegister" round>{{ modelType === 'login' ? '登录' : '注册' }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        rules: { // 表单验证规则
          username: [{ validator: this.checkName, trigger: 'blur' }],
          password: [{ validator: this.checkPass, trigger: 'blur' }],
          email: [{ validator: this.checkEmail, trigger: 'blur' }],
        }
      }
    },
    props: {
      "modelType":{
        type: String,
        default: 'login'
      }
    },
    methods: {
      async loginOrRegister(){
        let flag
        try {
          flag = await this.$refs['modelForm'].validate()
        } catch (error) {
          // console.log(error);
        }
        if(flag){
          this.$api({ type: this.modelType, data: this.form, successCb: () => {
            this.dialogFormVisible = false
            this.$refs['modelForm'].resetFields()
            if(this.$store.state.authorId){
              // TODO 文章详情页的文章作者已注销账号的情况下，不会自动刷新
              location.reload()
            }
          },errorCb: () => {
            // 登录或注册失败的回调
          }})
        }
      },
      openDialog(){
        this.dialogFormVisible = true
        this.$refs['modelForm'] && this.$refs['modelForm'].resetFields()
      },  
      resetForm(){
        this.$refs['modelForm'].resetFields()
      },
      checkName(rule, value, callback){
        if(this.modelType === 'login'){
          return callback()
        }
        if (!value) {
          return callback(new Error('请输入用户名'))
        }
        /^(?!\d+$)[a-zA-Z0-9\u4e00-\u9fa5]{6,8}$/.test(value) ? callback() : callback('用户名必须包含数字和字母且长度为6-8位')
      },
      checkPass(rule, value, callback){
        if(this.modelType === 'login'){
          return callback()
        }
        if (!value) {
          return callback(new Error('请输入密码'))
        } 
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/.test(value) ? callback() : callback('密码必须包含大小写字母和数字，且长度大于8小于12') // 可以包含 !.#*?& 字符
      },
      checkEmail(rule, value, callback){
        if(this.modelType === 'login'){
          return callback()
        }
        if (!value) {
          return callback(new Error('请输入邮箱地址'))
        }
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value) ? callback() : callback('请输入正确的邮箱地址')
      }
    }
  }
</script>

<style lang="stylus">
.el-dialog__header
  margin-right 0!important
  text-align center
  padding-bottom 0!important
  padding-top 0!important
.dialog-footer button.mr
  margin-right 10px
.el-dialog__footer
  padding 0 !important
  text-align center!important // 让表单中登录/注册按钮居中
.el-form-item__label
  display inline-block!important
  text-align-last justify 
.el-dialog__body
  padding-top 0px!important
  padding-bottom 0px!important
</style>
