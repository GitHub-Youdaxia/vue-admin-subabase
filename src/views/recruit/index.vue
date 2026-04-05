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
        <el-table-column prop="location" label="工作地点" width="120" />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { jobsService } from '@/api/company';

const jobList = ref([]);

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
</style>