<template>
  <div class="password-change">
    <el-form :model="passwordForm" label-position="right" :label-width="100">
      <el-form-item>
        <template #label>
          <RequiredLabel required>当前密码</RequiredLabel>
        </template>
        <el-input v-model="passwordForm.currentPassword" type="password" placeholder="请输入当前密码" show-password />
      </el-form-item>
      <el-form-item>
        <template #label>
          <RequiredLabel required>新密码</RequiredLabel>
        </template>
        <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item>
        <template #label>
          <RequiredLabel required>确认新密码</RequiredLabel>
        </template>
        <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitPasswordForm">修改密码</el-button>
        <el-button @click="resetPasswordForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import api from '@/services'
import type { ChangePassWordDTO } from '@/types/index.ts';
import RequiredLabel from "@/components/basic/RequiredLabel.vue";

// 密码表单数据
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 提交密码修改表单
const submitPasswordForm = async () => {
  const passwordData: ChangePassWordDTO = {
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword,
    confirmPassword: passwordForm.confirmPassword
  };

  await api.user.changePassword(passwordData);
  resetPasswordForm();
};

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
};
</script>

<style scoped>
.password-change {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 控制表单项最大宽度 */
.password-change .el-form-item {
  max-width: 600px;
}
</style>