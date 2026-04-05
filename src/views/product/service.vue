<template>
  <div class="services">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>服务管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="serviceList" style="width: 100%">
        <el-table-column prop="name" label="服务名称" width="180" />
        <el-table-column prop="description" label="服务描述" />
        <el-table-column prop="price" label="价格" width="100" />
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
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3" placeholder="请输入服务描述" />
        </el-form-item>
        <el-form-item label="服务流程" prop="process">
          <el-input v-model="formData.process" placeholder="请输入服务流程，用逗号分隔" />
        </el-form-item>
        <el-form-item label="服务价格" prop="price">
          <el-input v-model="formData.price" placeholder="请输入服务价格" />
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
import { servicesService } from '@/api/company';

const serviceList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  name: '',
  description: '',
  process: [],
  price: ''
});
const formRules = {
  name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入服务描述', trigger: 'blur' }]
};

onMounted(() => {
  fetchServiceList();
});

const fetchServiceList = async () => {
  try {
    const result = await servicesService.queryAll();
    serviceList.value = result.list;
  } catch (error) {
    ElMessage.error('获取服务列表失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加服务';
  formData.value = {
    name: '',
    description: '',
    process: [],
    price: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑服务';
  // 处理process数组
  if (Array.isArray(row.process)) {
    formData.value = { ...row, process: row.process.join(',') };
  } else {
    formData.value = { ...row, process: '' };
  }
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 处理process数组
        const submitData = { ...formData.value };
        if (typeof submitData.process === 'string') {
          submitData.process = submitData.process.split(',').map(item => item.trim()).filter(Boolean);
        }
        
        if (submitData.id) {
          // 编辑
          await servicesService.update(submitData);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await servicesService.add(submitData);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchServiceList();
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
    await servicesService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchServiceList();
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