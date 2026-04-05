<template>
  <div class="news">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>新闻动态管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="newsList" style="width: 100%">
        <el-table-column prop="title" label="新闻标题" width="250" />
        <el-table-column prop="content" show-overflow-tooltip label="新闻内容" width="250" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="publish_date" label="发布日期" width="150" />
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
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="新闻分类" prop="category">
          <el-input v-model="formData.category" placeholder="请输入新闻分类" />
        </el-form-item>
        <el-form-item label="新闻内容" prop="content">
          <el-input v-model="formData.content" type="textarea" rows="5" placeholder="请输入新闻内容" />
        </el-form-item>
        <el-form-item label="新闻图片" prop="image">
          <el-input v-model="formData.image" placeholder="请输入新闻图片URL" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publish_date">
          <el-date-picker v-model="formData.publish_date" type="datetime" placeholder="选择发布日期" style="width: 100%" />
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
import { newsService } from '@/api/company';

const newsList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  title: '',
  category: '',
  content: '',
  image: '',
  publish_date: new Date()
});
const formRules = {
  title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }]
};

onMounted(() => {
  fetchNewsList();
});

const fetchNewsList = async () => {
  try {
    const result = await newsService.queryAll();
    newsList.value = result.list;
  } catch (error) {
    ElMessage.error('获取新闻列表失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加新闻';
  formData.value = {
    title: '',
    category: '',
    content: '',
    image: '',
    publish_date: new Date()
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑新闻';
  formData.value = { ...row };
  // 处理日期格式
  if (row.publish_date) {
    formData.value.publish_date = new Date(row.publish_date);
  }
  dialogVisible.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitData = { ...formData.value };
        // 处理日期格式
        if (submitData.publish_date) {
          submitData.publish_date = submitData.publish_date.toISOString();
        }
        
        if (submitData.id) {
          // 编辑
          await newsService.update(submitData);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await newsService.add(submitData);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchNewsList();
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
    await newsService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchNewsList();
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