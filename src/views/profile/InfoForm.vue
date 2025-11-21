<template>
  <div class="profile-info-form">
    <el-form :model="form" label-position="right" :label-width="80" ref="formRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      <el-form-item prop="name">
        <template #label>
          <RequiredLabel required>姓名</RequiredLabel>
        </template>
        <el-input v-model="form.name" placeholder="请输入您的姓名" />
      </el-form-item>
      <el-form-item prop="sex">
        <template #label>
          <RequiredLabel required>性别</RequiredLabel>
        </template>
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="signature">
        <template #label>
          <RequiredLabel>个性签名</RequiredLabel>
        </template>
        <el-input 
          v-model="form.signature" 
          type="textarea"
          :rows="4" 
          placeholder="请输入您的个性签名" 
          maxlength="200" 
          show-word-limit
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">保存修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { UserVO } from '@/services';
import { useUserStore } from '@/stores';
import RequiredLabel from '@/components/basic/RequiredLabel.vue';
import {getValues} from "@/utils";
import { UserSex } from '@/services';

// 获取 user store
const userStore = useUserStore();
// 接收父组件传入的用户信息
const props = defineProps<{
  userInfo: UserVO
}>();
// 个人信息表单数据
const form = reactive({
  username: '',
  name: '',
  sex: '' as UserSex,
  signature: '',
});

// 填充表单数据
const fillFormData = () => {
  if (props.userInfo) {
    form.username = props.userInfo.username || '';
    form.name = props.userInfo.name || '';
    form.sex = props.userInfo.sex || '';
    form.signature = props.userInfo.signature || '';
  }
};

// 性别选项
const sexOptions = getValues(UserSex).map(value => ({
  label: value,
  value: value
}))

// 提交个人信息表单
const submitForm = async () => {
    // 准备更新数据
    const updateData = {
      id: props.userInfo.id,
      name: form.name,
      sex: form.sex,
      signature: form.signature
    };

    // 调用 store 的方法更新用户信息
    await userStore.updateUserInfo(updateData, true);
};

// 重置个人信息表单
const resetForm = () => {
  if (props.userInfo) {
    form.username = props.userInfo.username || '';
    form.name = props.userInfo.name || '';
    form.sex = props.userInfo.sex || '';
    form.signature = props.userInfo.signature || '';
  }
};

// 监听用户信息变化
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    fillFormData();
  }
}, { immediate: true });
</script>

<style scoped>
.profile-info-form {
  display: flex;
  flex-direction: column;
}

/* 控制表单项最大宽度 */
.profile-info-form .el-form-item {
  max-width: 600px;
}
</style>