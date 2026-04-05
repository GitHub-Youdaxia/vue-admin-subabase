<template>
  <div class="contact-info">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>联系信息管理</span>
          <el-button type="primary" @click="handleEdit">编辑</el-button>
        </div>
      </template>
      <el-form :model="contactInfo" label-width="80px">
        <el-form-item label="电话">
          <el-input v-model="contactInfo.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="contactInfo.email" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="contactInfo.address" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="工作时间">
          <el-input v-model="contactInfo.working_hours" type="textarea" rows="2" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { contactInfoService } from '@/api/company';

const contactInfo = ref({
  phone: '',
  email: '',
  address: '',
  working_hours: ''
});

onMounted(() => {
  fetchContactInfo();
});

const fetchContactInfo = async () => {
  try {
    const result = await contactInfoService.queryAll();
    if (result.list.length > 0) {
      contactInfo.value = result.list[0];
    } else {
      // 初始化默认数据
      contactInfo.value = {
        phone: '12345678900',
        email: 'contact@example.com',
        address: '北京市朝阳区某某大厦',
        working_hours: '周一至周五 9:00-18:00'
      };
    }
  } catch (error) {
    ElMessage.error('获取联系信息失败');
  }
};

const handleEdit = () => {
  // 打开编辑对话框
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>