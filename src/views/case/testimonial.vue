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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { testimonialsService } from '@/api/company';

const testimonialList = ref([]);

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
</style>