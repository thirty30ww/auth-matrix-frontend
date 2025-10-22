<template>
  <el-dialog
    v-model="visible"
    width="600px"
    :before-close="handleClose"
    destroy-on-close
    :show-close="false"
  >
    <div class="avatar-crop-container">
      <div class="sidebar">
        <div class="sidebar-content">
          <div class="preview-avatar">
            <div class="preview-box" ref="previewBox"></div>
          </div>
          
          <div class="image-info">
            <div class="info-item">
              <label>图片名称:</label>
              <span>{{ imageFileName }}</span>
            </div>
            <div class="info-item">
              <label>图片尺寸:</label>
              <span>{{ imageDimensions }}</span>
            </div>
            <div class="info-item">
              <label>文件大小:</label>
              <span>{{ imageFileSize }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="crop-section">
        <div class="crop-wrapper">
          <vue-cropper
            ref="cropperRef"
            :img="imgSrc"
            :output-size="1"
            :output-type="'jpeg'"
            :info="true"
            :full="false"
            :can-move="true"
            :can-move-box="true"
            :original="false"
            :auto-crop="true"
            :auto-crop-width="cropDimensions.width"
            :auto-crop-height="cropDimensions.height"
            :fixed-box="true"
            :fixed="true"
            :fixed-number="[1, 1]"
            :center-box="true"
            :info-true="true"
            :mode="'contain'"
          ></vue-cropper>
        </div>
        
        <!-- 操作按钮区域 -->
        <div class="action-buttons">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="rotateLeft">
            <el-icon><RefreshLeft /></el-icon>
            左旋转
          </el-button>
          <el-button @click="rotateRight">
            <el-icon><RefreshRight /></el-icon>
            右旋转
          </el-button>
          <el-button type="primary" @click="handleConfirm" :loading="uploading">
            确认上传
          </el-button>
        </div>
      </div>
    </div>

  </el-dialog>
</template>

<script setup lang="ts">
import {computed, nextTick, ref, watch} from 'vue';
import {RefreshLeft, RefreshRight} from '@element-plus/icons-vue';
import {VueCropper} from 'vue-cropper';
import 'vue-cropper/dist/index.css';
import type {Emits, Props} from "@/services";

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
});

const emit = defineEmits<Emits>();

// 响应式数据
const visible = ref(false);
const imgSrc = ref('');
const cropperRef = ref();
const previewBox = ref();
const uploading = ref(false);
const imageInfo = ref({
  fileName: '',
  width: 0,
  height: 0,
  size: 0
});
const cropDimensions = ref({
  width: 200,
  height: 200
});

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
  if (newVal && props.imageFile) {
    loadImage(props.imageFile);
  }
});

// 监听 visible 变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal);
});

// 加载图片
const loadImage = (file: File) => {
  // 保存文件信息
  imageInfo.value.fileName = file.name;
  imageInfo.value.size = file.size;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    imgSrc.value = e.target?.result as string;
    
    // 获取图片尺寸
    const img = new Image();
    img.onload = () => {
      imageInfo.value.width = img.width;
      imageInfo.value.height = img.height;
      
      // 计算合适的裁剪框尺寸，裁剪框边长和图片最短边相等
      const cropSize = Math.min(img.width, img.height);
      
      cropDimensions.value.width = cropSize;
      cropDimensions.value.height = cropSize;
      
      nextTick(() => {
        startCrop();
      });
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// 开始裁剪
const startCrop = () => {
  if (cropperRef.value) {
    cropperRef.value.startCrop();
    realTimePreview();
  }
};

// 更新预览
const updatePreview = () => {
  if (!cropperRef.value || !previewBox.value) return;
  
  cropperRef.value.getCropData((data: string) => {
    if (previewBox.value) {
      previewBox.value.innerHTML = `<img src="${data}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"  alt=""/>`;
    }
  });
};

// 实时预览
const realTimePreview = () => {
  if (!cropperRef.value) return;
  
  // 初始预览
  setTimeout(updatePreview, 100);
  
  // 监听所有相关事件以实现实时预览
  if (cropperRef.value && cropperRef.value.$el) {
    const events = ['cropmove', 'cropend', 'zoom', 'cropstart'];
    events.forEach(event => {
      cropperRef.value.$el.addEventListener(event, updatePreview);
    });
    
    // 监听鼠标移动和滚轮事件
    cropperRef.value.$el.addEventListener('mousemove', updatePreview);
    cropperRef.value.$el.addEventListener('wheel', updatePreview);
    
    // 设置定时器持续更新预览
    const intervalId = setInterval(() => {
      if (visible.value && cropperRef.value) {
        updatePreview();
      } else {
        clearInterval(intervalId);
      }
    }, 200);
  }
};

// 左旋转
const rotateLeft = () => {
  if (cropperRef.value) {
    cropperRef.value.rotateLeft();
    // 旋转后更新预览
    setTimeout(updatePreview, 100);
  }
};

// 右旋转
const rotateRight = () => {
  if (cropperRef.value) {
    cropperRef.value.rotateRight();
    // 旋转后更新预览
    setTimeout(updatePreview, 100);
  }
};

// 确认裁剪
const handleConfirm = () => {
  if (!cropperRef.value) return;
  
  uploading.value = true;
  
  cropperRef.value.getCropBlob((blob: Blob) => {
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
    emit('confirm', file);
    uploading.value = false;
    handleClose();
  });
};

// 关闭对话框
const handleClose = () => {
  visible.value = false;
  imgSrc.value = '';
  uploading.value = false;
  // 重置图片信息
  imageInfo.value = {
    fileName: '',
    width: 0,
    height: 0,
    size: 0
  };
};

// 计算属性
const imageFileName = computed(() => {
  return imageInfo.value.fileName || '未选择文件';
});

const imageDimensions = computed(() => {
  if (imageInfo.value.width && imageInfo.value.height) {
    return `${imageInfo.value.width} × ${imageInfo.value.height}`;
  }
  return '计算中...';
});

const imageFileSize = computed(() => {
  const size = imageInfo.value.size;
  if (size === 0) return '计算中...';
  
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
});
</script>

<style scoped>
.avatar-crop-container {
  display: flex;
  height: 400px;
}

.crop-section {
  flex: 2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.crop-wrapper {
  flex: 1;
  border-radius: var(--radius-dialog);
  overflow: hidden;
}

.sidebar {
  flex: 1;
  background-color: var(--pp-bg-color);
  border-radius: var(--radius-dialog);
  border: 1px solid var(--pp-border-color-light);
}

.sidebar-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-box {
  width: 120px;
  height: 120px;
  border: 2px solid var(--el-border-color);
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--el-fill-color-light);
  box-shadow: var(--el-box-shadow-light);
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--el-text-color-regular);
}

.info-item span {
  font-size: var(--font-size-xs);
  color: var(--el-text-color-primary);
  word-break: break-all;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
}

.action-buttons .el-button {
  margin: 0;
}
</style>