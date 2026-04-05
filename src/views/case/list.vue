<template>
  <div class="cases">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户案例管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="caseList" style="width: 100%">
        <el-table-column prop="name" label="案例名称" width="180" />
        <el-table-column prop="client" label="客户" width="120" />
        <el-table-column prop="industry" label="行业" width="100" />
        <el-table-column prop="description" label="案例描述" />
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
        <el-form-item label="案例名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入案例名称" />
        </el-form-item>
        <el-form-item label="客户" prop="client">
          <el-input v-model="formData.client" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="formData.industry" placeholder="请输入行业" />
        </el-form-item>
        <el-form-item label="案例描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3" placeholder="请输入案例描述" />
        </el-form-item>
        <el-form-item label="案例图片" prop="image">
          <el-input v-model="formData.image" placeholder="请输入案例图片URL" />
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
import { casesService } from '@/api/company';

const caseList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  name: '',
  client: '',
  industry: '',
  description: '',
  image: ''
});
const formRules = {
  name: [{ required: true, message: '请输入案例名称', trigger: 'blur' }],
  client: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入案例描述', trigger: 'blur' }]
};

onMounted(() => {
  fetchCaseList();
});

const fetchCaseList = async () => {
  try {
    const result = await casesService.queryAll();
    caseList.value = result.list;
  } catch (error) {
    ElMessage.error('获取案例列表失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加案例';
  formData.value = {
    name: '',
    client: '',
    industry: '',
    description: '',
    image: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑案例';
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
          await casesService.update(formData.value);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await casesService.add(formData.value);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchCaseList();
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
    await casesService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchCaseList();
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