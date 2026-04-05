<template>
  <div class="messages">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>在线留言管理</span>
        </div>
      </template>
      <el-table :data="messageList" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="subject" label="主题" width="150" />
        <el-table-column prop="content" label="留言内容" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'success'">
              {{ scope.row.status === 'pending' ? '待处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" @click="handleProcess(scope.row.id)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { messagesService } from '@/api/company';

const messageList = ref([]);

onMounted(() => {
  fetchMessageList();
});

const fetchMessageList = async () => {
  try {
    const result = await messagesService.queryAll();
    messageList.value = result.list;
  } catch (error) {
    ElMessage.error('获取留言列表失败');
  }
};

const handleView = (row) => {
  // 打开查看对话框
};

const handleProcess = async (id) => {
  try {
    await messagesService.update({ id, status: 'processed' });
    ElMessage.success('处理成功');
    fetchMessageList();
  } catch (error) {
    ElMessage.error('处理失败');
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