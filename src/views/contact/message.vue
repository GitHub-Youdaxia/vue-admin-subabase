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
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 查看对话框 -->
    <el-dialog v-model="dialogVisible" title="查看留言" width="600px">
      <el-form :model="viewData" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="viewData.name" disabled />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="viewData.email" disabled />
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="viewData.subject" disabled />
        </el-form-item>
        <el-form-item label="留言内容">
          <el-input v-model="viewData.content" type="textarea" rows="5" disabled />
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="viewData.status === 'pending' ? 'warning' : 'success'">
            {{ viewData.status === 'pending' ? '待处理' : '已处理' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="viewData.created_at" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { messagesService } from '@/api/company';

const messageList = ref([]);
const dialogVisible = ref(false);
const viewData = ref({});

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
  viewData.value = { ...row };
  dialogVisible.value = true;
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

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条留言吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await messagesService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchMessageList();
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