<template>
  <div class="company-info">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>公司信息管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="companyList" style="width: 100%">
        <el-table-column prop="name" label="公司名称" width="180" />
        <el-table-column prop="description" show-overflow-tooltip label="公司简介" />
        <el-table-column prop="vision" show-overflow-tooltip label="公司愿景" width="200" />
        <el-table-column prop="mission" show-overflow-tooltip label="公司使命" width="200" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="公司Logo" prop="logo">
          <el-input v-model="formData.logo" placeholder="请输入Logo URL" />
        </el-form-item>
        <el-form-item label="公司简介" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3" placeholder="请输入公司简介" />
        </el-form-item>
        <el-form-item label="公司历史" prop="history">
          <el-input v-model="formData.history" type="textarea" rows="3" placeholder="请输入公司历史" />
        </el-form-item>
        <el-form-item label="企业文化" prop="culture">
          <el-input v-model="formData.culture" type="textarea" rows="3" placeholder="请输入企业文化" />
        </el-form-item>
        <el-form-item label="公司愿景" prop="vision">
          <el-input v-model="formData.vision" placeholder="请输入公司愿景" />
        </el-form-item>
        <el-form-item label="公司使命" prop="mission">
          <el-input v-model="formData.mission" placeholder="请输入公司使命" />
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
import { companyInfoService } from '@/api/company';

const companyList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  name: '',
  logo: '',
  description: '',
  history: '',
  culture: '',
  vision: '',
  mission: ''
});
const formRules = {
  name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
};

onMounted(() => {
  fetchCompanyList();
});

const fetchCompanyList = async () => {
  try {
    const result = await companyInfoService.queryAll();
    companyList.value = result.list;
  } catch (error) {
    ElMessage.error('获取公司信息失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加公司信息';
  formData.value = {
    name: '',
    logo: '',
    description: '',
    history: '',
    culture: '',
    vision: '',
    mission: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑公司信息';
  formData.value = { ...row };
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.value.id) {
          // 编辑
          await companyInfoService.update(formData.value);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await companyInfoService.add(formData.value);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchCompanyList();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条数据吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await companyInfoService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchCompanyList();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
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

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>