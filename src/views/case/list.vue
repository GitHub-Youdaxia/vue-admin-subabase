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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { casesService } from '@/api/company';

const caseList = ref([]);

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
</style>