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
        <el-form-item label="地图链接">
          <el-input v-model="contactInfo.map_url" />
        </el-form-item>
        <el-form-item label="工作时间">
          <el-input v-model="contactInfo.working_hours" type="textarea" rows="2" />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑联系信息" width="600px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" type="textarea" rows="3" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="地图链接" prop="map_url">
          <el-input v-model="formData.map_url" placeholder="请输入地图链接" />
        </el-form-item>
        <el-form-item label="工作时间" prop="working_hours">
          <el-input v-model="formData.working_hours" type="textarea" rows="2" placeholder="请输入工作时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
  map_url: '',
  working_hours: ''
});
const dialogVisible = ref(false);
const formRef = ref();
const formData = ref({
  phone: '',
  email: '',
  address: '',
  map_url: '',
  working_hours: ''
});
const formRules = {
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
};

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
        map_url: '',
        working_hours: '周一至周五 9:00-18:00'
      };
    }
  } catch (error) {
    ElMessage.error('获取联系信息失败');
  }
};

const handleEdit = () => {
  formData.value = { ...contactInfo.value };
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.value.id) {
          // 编辑
          await contactInfoService.update(formData.value);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await contactInfoService.add(formData.value);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchContactInfo();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>