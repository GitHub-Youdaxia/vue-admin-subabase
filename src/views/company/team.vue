<template>
  <div class="team-members">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>团队成员管理</span>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </template>
      <el-table :data="teamList" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="position" label="职位" width="150" />
        <el-table-column prop="bio" label="简介" />
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="formData.avatar" placeholder="请输入头像URL" />
        </el-form-item>
        <el-form-item label="简介" prop="bio">
          <el-input v-model="formData.bio" type="textarea" rows="3" placeholder="请输入简介" />
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
import { teamMembersService } from '@/api/company';

const teamList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const formData = ref({
  name: '',
  position: '',
  avatar: '',
  bio: ''
});
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }]
};

onMounted(() => {
  fetchTeamList();
});

const fetchTeamList = async () => {
  try {
    const result = await teamMembersService.queryAll();
    teamList.value = result.list;
  } catch (error) {
    ElMessage.error('获取团队成员失败');
  }
};

const handleAdd = () => {
  dialogTitle.value = '添加团队成员';
  formData.value = {
    name: '',
    position: '',
    avatar: '',
    bio: ''
  };
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  dialogTitle.value = '编辑团队成员';
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
          await teamMembersService.update(formData.value);
          ElMessage.success('编辑成功');
        } else {
          // 添加
          await teamMembersService.add(formData.value);
          ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchTeamList();
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
    await teamMembersService.delete({ ids: [id] });
    ElMessage.success('删除成功');
    fetchTeamList();
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