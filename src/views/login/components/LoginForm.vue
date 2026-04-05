<template>
	<el-tabs v-model="activeTab" class="login-tabs">
		<el-tab-pane label="登录" name="login">
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
		</el-tab-pane>
		<el-tab-pane label="注册" name="register">
			<el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
				<el-form-item prop="email">
					<el-input v-model="registerForm.email" placeholder="邮箱：your@email.com">
						<template #prefix>
							<el-icon class="el-input__icon"><user /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" v-model="registerForm.password" placeholder="密码：至少6位" show-password autocomplete="new-password">
						<template #prefix>
							<el-icon class="el-input__icon"><lock /></el-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="confirmPassword">
					<el-input type="password" v-model="registerForm.confirmPassword" placeholder="确认密码" show-password autocomplete="new-password">
						<template #prefix>
							<el-icon class="el-input__icon"><lock /></el-icon>
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<div class="login-btn">
				<el-button @click="register(registerFormRef)" size="large" type="primary" :loading="loading"> 注册 </el-button>
				<el-button @click="resetRegisterForm(registerFormRef)" size="large">重置</el-button>
			</div>
		</el-tab-pane>
	</el-tabs>
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

// 激活的标签页
const activeTab = ref("login");

// 登录表单
const loginFormRef = ref();
const loginRules = reactive({
	username: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});
const loginForm = reactive({ username: "2354339265@qq.com", password: "aaaaaa" });

// 注册表单
const registerFormRef = ref();
const registerRules = reactive({
	email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }],
	confirmPassword: [
		{ required: true, message: "请确认密码", trigger: "blur" },
		{
			validator: (rule, value, callback) => {
				if (value !== registerForm.password) {
					callback(new Error("两次输入的密码不一致"));
				} else {
					callback();
				}
			},
			trigger: "blur"
		}
	]
});
const registerForm = reactive({ email: "", password: "", confirmPassword: "" });

const loading = ref(false);

// 登录方法
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
				message: "欢迎登录后台管理平台",
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

// 注册方法
const register = formEl => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			const { user } = await supabaseAuthService.registerWithEmail(
				registerForm.email,
				registerForm.password
			);
			
			ElNotification({
				title: "注册成功",
				message: "请登录您的邮箱验证账号",
				type: "success",
				duration: 3000
			});
			
			// 切换到登录标签
			activeTab.value = "login";
			// 清空表单
			resetRegisterForm(registerFormRef);
		} catch (error) {
			ElNotification({
				title: "注册失败",
				message: error.message || "注册失败，请稍后重试",
				type: "error",
				duration: 3000
			});
		} finally {
			loading.value = false;
		}
	});
};

// 重置登录表单
const resetForm = formEl => {
	if (!formEl) return;
	formEl.resetFields();
};

// 重置注册表单
const resetRegisterForm = formEl => {
	if (!formEl) return;
	formEl.resetFields();
};
</script>

<style scoped lang="scss">
.login-tabs {
	width: 100%;
}
</style>

<style scoped lang="scss"></style>
