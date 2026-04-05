<template>
  <div class="recruit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>招聘信息管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="jobList" style="width: 100%">
        <el-table-column prop="title" label="职位名称" width="180" />
        <el-table-column prop="salary" label="薪资" width="120" />
        <el-table-column prop="location" label="工作地点" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'open' ? 'success' : 'info'">
              {{ scope.row.status === 'open' ? '招聘中' : '已关闭' }}
            </el-tag>
          </template>
        </el-table-column>
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
        <el-form-item label="职位名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="职位要求" prop="requirements">
          <el-input v-model="formData.requirements" type="textarea" rows="3" placeholder="请输入职位要求" />
        </el-form-item>
        <el-form-item label="工作职责" prop="responsibilities">
          <el-input v-model="formData.responsibilities" type="textarea" rows="3" placeholder="请输入工作职责" />
        </el-form-item>
        <el-form-item label="薪资" prop="salary">
          <el-input v-model="formData.salary" placeholder="请输入薪资" />
        </el-form-item>
        <el-form-item label="工作地点" prop="location">
          <el-input v-model="formData.location" placeholder="请输入工作地点" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="招聘中" value="open" />
            <el-option label="已关闭" value="closed" />
          </el-select>
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
import { jobsService } from '@/api/company';

const jobList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  title: '',
  requirements: '',
  responsibilities: '',
  salary: '',
  location: '',
  status: 'open'
});
const formRules = {
  title: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  requirements: [{ required: true, message: '请输入职位要求', trigger: 'blur' }],
  responsibilities: [{ required: true, message: '请输入工作职责', trigger: 'blur' }]
};

onMounted(() => {
  fetchJobList();
});

const fetchJobList = async () => {
  try {
    const result = await jobsService.queryAll();
    jobList.value = result.list;
  } catch (error) {
    ElMessage.error('获取招聘信息失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加招聘职位';
  formData.value = {
    title: '',
    requirements: '',
    responsibilities: '',
    salary: '',
    location: '',
    status: 'open'
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑招聘职位';
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
          await jobsService.update(formData.value);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await jobsService.add(formData.value);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchJobList();
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
    await jobsService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchJobList();
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