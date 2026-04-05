<template>
  <div class="products">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>产品管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="productList" style="width: 100%">
        <el-table-column prop="name" label="产品名称" width="180" />
        <el-table-column prop="description" label="产品描述" />
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
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="formData.description" type="textarea" rows="3" placeholder="请输入产品描述" />
        </el-form-item>
        <el-form-item label="产品特点" prop="features">
          <el-input v-model="formData.features" placeholder="请输入产品特点，用逗号分隔" />
        </el-form-item>
        <el-form-item label="产品图片" prop="image">
          <el-input v-model="formData.image" placeholder="请输入产品图片URL" />
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
import { productsService } from '@/api/company';

const productList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  name: '',
  description: '',
  features: [],
  image: ''
});
const formRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入产品描述', trigger: 'blur' }]
};

onMounted(() => {
  fetchProductList();
});

const fetchProductList = async () => {
  try {
    const result = await productsService.queryAll();
    productList.value = result.list;
  } catch (error) {
    ElMessage.error('获取产品列表失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加产品';
  formData.value = {
    name: '',
    description: '',
    features: [],
    image: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑产品';
  // 处理features数组
  if (Array.isArray(row.features)) {
    formData.value = { ...row, features: row.features.join(',') };
  } else {
    formData.value = { ...row, features: '' };
  }
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 处理features数组
        const submitData = { ...formData.value };
        if (typeof submitData.features === 'string') {
          submitData.features = submitData.features.split(',').map(item => item.trim()).filter(Boolean);
        }
        
        if (submitData.id) {
          // 编辑
          await productsService.update(submitData);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await productsService.add(submitData);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchProductList();
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
    await productsService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchProductList();
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