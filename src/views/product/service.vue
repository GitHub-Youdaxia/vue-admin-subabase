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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { servicesService } from '@/api/company';

const serviceList = ref([]);

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
</style>