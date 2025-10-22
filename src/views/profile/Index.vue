<template>
  <div class="profile-container">
    <div class="profile-card">
      <div v-if="userInfo" class="user-info-card">
        <el-avatar class="avatar-container clickable" @click="triggerAvatarUpload">
          <UserAvatar class="default-avatar" :imageUrl="userInfo?.avatarUrl || userInfo?.avatarUrl || undefined" />
          <div class="avatar-hover-overlay">
            <el-icon><Edit /></el-icon>
          </div>
        </el-avatar>
        <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" />
        <div class="user-details">
          <h2 class="user-name">{{ userInfo?.name }}</h2>
          <p class="signature-text">{{ userInfo?.signature || '这个人很懒，什么都没留下...' }}</p>
          
          <div class="user-info-section">
            <div class="info-item">
              <el-icon class="info-icon"><User /></el-icon>
              <span class="info-label">用户名</span>
              <span class="info-value">{{ userInfo?.username }}</span>
            </div>
            
            <div class="info-item">
              <el-icon class="info-icon"><Medal /></el-icon>
              <span class="info-label">角色</span>
              <el-tag
                  v-for="role in userInfo.roles"
                  :key="role.id"
                  :type="getValue(LevelTagType, role.level, elType.PRIMARY)"
                  style="margin-right: var(--margin-size-spacing-1);"
              >
                {{ role.name }}
              </el-tag>
            </div>
            
            <div class="info-item">
              <el-icon class="info-icon"><Avatar /></el-icon>
              <span class="info-label">性别</span>
              <span class="info-value">{{ userInfo?.sex }}</span>
            </div>
            
            <div class="info-item">
              <el-icon class="info-icon"><Calendar /></el-icon>
              <span class="info-label">创建时间</span>
              <span class="info-value">{{ formatDate(userInfo?.createTime) }}</span>
            </div>

            <!-- 在用户信息展示部分添加 -->
            <template v-for="(item, index) in extraFields" :key="`extra-${index}`">
              <div class="info-item" v-if="(userInfo as any)?.[item.key]">
                <el-icon v-if="item.icon" class="info-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="info-label">{{ item.label }}</span>
                <span class="info-value">
                  {{ item.formatter ? item.formatter((userInfo as any)[item.key]) : (userInfo as any)[item.key] }}
                </span>
              </div>
            </template>
            
            <!-- 添加扩展信息显示插槽 -->
            <slot name="extended-info" :userInfo="userInfo"></slot>
          </div>
        </div>
      </div>
    </div>
    
    <div class="profile-form">
      <div class="profile-nav">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="个人信息" name="info"></el-tab-pane>
          <el-tab-pane label="修改密码" name="password"></el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="tab-content">
        <!-- 个人信息表单组件 -->
        <div v-if="activeTab === 'info'" class="tab-pane">
          <ProfileInfoForm v-if="userInfo" :userInfo="userInfo" />
          <div v-else class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>
        </div>
        
        <!-- 修改密码组件 -->
        <div v-if="activeTab === 'password'" class="tab-pane">
          <PasswordChange />
        </div>
      </div>
    </div>
  </div>

  <!-- 头像裁剪对话框 -->
  <AvatarCropDialog 
    v-model="showCropDialog" 
    :imageFile="selectedImageFile || undefined"
    @confirm="handleCropConfirm"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Edit, User, Avatar, Calendar, Medal } from '@element-plus/icons-vue';
import UserAvatar from '@/components/basic/UserAvatar.vue';
import ProfileInfoForm from '@/views/profile/InfoForm.vue';
import PasswordChange from '@/views/profile/PasswordChange.vue';
import AvatarCropDialog from '@/components/business/AvatarCropDialog.vue';
import { useUserStore } from '@/stores';
import api from '@/services';
import {formatDate, getValue} from '@/utils';
import {elType, LevelTagType} from "@/constant";
import type { ExtraField } from '@/services';

// 添加 props 接收扩展字段配置
const props = defineProps<{
  extraFields?: ExtraField[]
}>()

// 添加插槽定义
defineSlots<{
  'extended-info'(slotProps: { userInfo: any }): any  // 扩展信息显示插槽
}>()

// 路由
const route = useRoute();
const router = useRouter();
const activeTab = ref('info');
// 获取 user store
const userStore = useUserStore();
// 用户信息（使用计算属性）
const userInfo = computed(() => userStore.userInfo);
// 扩展字段计算属性
const extraFields = computed(() => props.extraFields || []);
const fileInputRef = ref<HTMLInputElement | null>(null);

// 头像裁剪相关
const showCropDialog = ref(false);
const selectedImageFile = ref<File | null>(null);

// 监听路由参数变化
watch(() => route.query.type, (newType) => {
  if (newType === 'password') {
    activeTab.value = 'password';
  } else {
    activeTab.value = 'info';
  }
}, { immediate: true });

// 处理标签切换
const handleTabClick = (tab: any) => {
  router.push({
    path: '/profile',
    query: { type: tab.props.name }
  });
};

// 触发文件选择
const triggerAvatarUpload = () => {
  fileInputRef.value?.click();
};

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  selectedImageFile.value = file;
  showCropDialog.value = true;
  
  // 清空文件输入框的值，允许重复选择同一文件
  target.value = '';
};

// 处理裁剪确认
const handleCropConfirm = async (croppedFile: File) => {
  // 1. 调用上传图片接口
  const imageUrl = await api.file.uploadImage(croppedFile);

  if (imageUrl && userInfo.value?.id) {
    // 2. 调用更新用户信息接口，传入图片URL
    await userStore.updateUserInfo({
      id: userInfo.value.id,
      avatarUrl: imageUrl
    });
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  // 重新获取一次用户信息
  userStore.getUserInfo()
});
</script>

<style scoped>
:root {
  --icon-size-title: 24px;
}

.profile-container {
  display: flex;
  gap: 25px;
}

.profile-card {
  flex: 1;
  max-width: 400px;
}

.user-info-card {
  background-color: var(--pp-bg-color-overlay);
  border-radius: var(--radius-card);
  padding: 25px;
  box-shadow: var(--el-box-shadow-light);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container {
  width: 130px;
  height: 130px;
  border-radius: var(--radius-half);
  margin-bottom: 5px;
  position: relative;
}

.clickable {
  cursor: pointer;
}

.avatar-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: var(--radius-half);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-hover-overlay .el-icon {
  color: white;
  font-size: var(--icon-size-md);
}

.avatar-container:hover .avatar-hover-overlay {
  opacity: 1;
}

.avatar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
}

.user-details {
  width: 100%;
  text-align: center;
}

.user-name {
  font-size: var(--font-size-title);
  margin-bottom: 0.5rem;
  color: var(--el-text-color-primary);
}

.signature-text {
  color: var(--el-text-color-secondary);
  font-style: italic;
  word-break: break-word;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.user-info-section {
  width: 100%;
  text-align: left;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  padding: 0.5rem 0;
}

.info-icon {
  color: var(--el-color-primary);
  margin-right: 10px;
  font-size: var(--icon-size-sm);
  min-width: 16px;
}

.info-label {
  color: var(--el-text-color-secondary);
  font-size: var(--font-size-sm);
  min-width: 60px;
  margin-right: 0.75rem;
}

.info-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
  flex: 1;
}

.profile-form {
  flex: 2;
  background-color: var(--pp-bg-color-overlay);
  border-radius: var(--radius-card);
  box-shadow: var(--el-box-shadow-light);
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 控制表单项最大宽度 */
.profile-form .el-form-item {
  max-width: 600px;
}

.tab-content {
  padding: 25px 25px 25px 0;
}

/* 加载状态样式 */
.loading-card, .loading-container {
  padding: 25px;
  background-color: var(--pp-bg-color-overlay);
  border-radius: var(--radius-card);
}

.loading-card {
  box-shadow: var(--el-box-shadow-light);
}

.tab-pane {
  animation: fade-in 0.3s ease-in-out;
}
</style>