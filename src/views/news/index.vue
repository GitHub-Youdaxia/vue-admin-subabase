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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { newsService } from '@/api/company';

const newsList = ref([]);

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
  // 打开添加对话框
};

const handleEdit = (row) => {
  // 打开编辑对话框
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
</style>