<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="邮箱：test@example.com">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" placeholder="密码：至少6位" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button @click="login(loginFormRef)" size="large" type="primary" :loading="loading"> 登录 </el-button>
		<el-button @click="resetForm(loginFormRef)" size="large">重置</el-button>
	</div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { GlobalStore } from "@/stores";
import { TabsStore } from "@/stores/modules/tabs";
import { HOME_URL } from "@/config/config";
import { supabaseAuthService } from "@/api/supabaseAuth";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { KeepAliveStore } from "@/stores/modules/keepAlive";

const router = useRouter();
const tabsStore = TabsStore();
const globalStore = GlobalStore();
const keepAlive = KeepAliveStore();

// 定义 formRef（校验规则）
const loginFormRef = ref();
const loginRules = reactive({
	username: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive({ username: "", password: "" });
const login = formEl => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			const { user, session } = await supabaseAuthService.loginWithEmail(
				loginForm.username,
				loginForm.password
			);
			
			// 设置token和用户信息
			globalStore.setToken(session.access_token);
			globalStore.setUserInfo({
				name: user.email.split('@')[0],
				email: user.email,
				id: user.id
			});
			
			await initDynamicRouter();
			tabsStore.closeMultipleTab();
			keepAlive.setKeepAliveName();
			router.push(HOME_URL);
			ElNotification({
				title: user.email.split('@')[0],
				message: "欢迎登录 vue-diverse-admin",
				type: "success",
				duration: 3000
			});
		} catch (error) {
			ElNotification({
				title: "登录失败",
				message: error.message || "请检查邮箱和密码是否正确",
				type: "error",
				duration: 3000
			});
		} finally {
			loading.value = false;
		}
	});
};

// resetForm
const resetForm = formEl => {
	if (!formEl) return;
	formEl.resetFields();
};
</script>

<style scoped lang="scss"></style>
