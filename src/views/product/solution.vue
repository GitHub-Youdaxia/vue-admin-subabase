<template>
  <div class="solutions">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>解决方案管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="solutionList" style="width: 100%">
        <el-table-column prop="name" label="方案名称" width="180" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="description" label="方案描述" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="方案名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入方案名称" />
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="formData.industry" placeholder="请输入行业" />
        </el-form-item>
        <el-form-item label="方案描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3" placeholder="请输入方案描述" />
        </el-form-item>
        <el-form-item label="方案图片" prop="image">
          <el-input v-model="formData.image" placeholder="请输入方案图片URL" />
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
import { solutionsService } from '@/api/company';

const solutionList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  name: '',
  industry: '',
  description: '',
  image: ''
});
const formRules = {
  name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入方案描述', trigger: 'blur' }]
};

onMounted(() => {
  fetchSolutionList();
});

const fetchSolutionList = async () => {
  try {
    const result = await solutionsService.queryAll();
    solutionList.value = result.list;
  } catch (error) {
    ElMessage.error('获取解决方案失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加解决方案';
  formData.value = {
    name: '',
    industry: '',
    description: '',
    image: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑解决方案';
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
          await solutionsService.update(formData.value);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await solutionsService.add(formData.value);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchSolutionList();
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
    await solutionsService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchSolutionList();
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