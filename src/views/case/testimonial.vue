<template>
  <div class="testimonials">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户评价管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="testimonialList" style="width: 100%">
        <el-table-column prop="client_name" label="客户姓名" width="120" />
        <el-table-column prop="client_company" label="公司" width="150" />
        <el-table-column prop="rating" label="评分" width="80" />
        <el-table-column prop="content" label="评价内容" />
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
        <el-form-item label="客户姓名" prop="client_name">
          <el-input v-model="formData.client_name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="公司" prop="client_company">
          <el-input v-model="formData.client_company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input v-model="formData.content" type="textarea" rows="3" placeholder="请输入评价内容" />
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="formData.rating" :max="5" />
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
import { testimonialsService } from '@/api/company';

const testimonialList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  client_name: '',
  client_company: '',
  content: '',
  rating: 5
});
const formRules = {
  client_name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  content: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
  rating: [{ required: true, message: '请选择评分', trigger: 'change' }]
};

onMounted(() => {
  fetchTestimonialList();
});

const fetchTestimonialList = async () => {
  try {
    const result = await testimonialsService.queryAll();
    testimonialList.value = result.list;
  } catch (error) {
    ElMessage.error('获取客户评价失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加客户评价';
  formData.value = {
    client_name: '',
    client_company: '',
    content: '',
    rating: 5
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑客户评价';
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
          await testimonialsService.update(formData.value);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await testimonialsService.add(formData.value);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchTestimonialList();
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
    await testimonialsService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchTestimonialList();
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