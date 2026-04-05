import { supabase } from "@/utils/supabase.js";

// Supabase认证服务
export const supabaseAuthService = {
	// 邮箱密码登录
	async loginWithEmail(email, password) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			throw error;
		}

		return data;
	},

	// 邮箱密码注册
	async registerWithEmail(email, password, options = {}) {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options
		});

		if (error) {
			throw error;
		}

		return data;
	},

	// 登出
	async logout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			throw error;
		}

		return true;
	},

	// 获取当前用户
	async getCurrentUser() {
		const { data: { user } } = await supabase.auth.getUser();
		return user;
	},

	// 获取会话信息
	async getSession() {
		const { data: { session } } = await supabase.auth.getSession();
		return session;
	},

	// 刷新令牌
	async refreshToken() {
		const { data, error } = await supabase.auth.refreshSession();

		if (error) {
			throw error;
		}

		return data;
	},

	// 发送密码重置邮件
	async resetPassword(email) {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: window.location.origin + "/auth/reset-password"
		});

		if (error) {
			throw error;
		}

		return data;
	},

	// 更新密码
	async updatePassword(newPassword) {
		const { error } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (error) {
			throw error;
		}

		return true;
	},

	// 更新用户信息
	async updateUser(data) {
		const { error } = await supabase.auth.updateUser(data);

		if (error) {
			throw error;
		}

		return true;
	},

	// 第三方登录 - Google
	async loginWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: window.location.origin
			}
		});

		if (error) {
			throw error;
		}

		return data;
	},

	// 第三方登录 - GitHub
	async loginWithGitHub() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: window.location.origin
			}
		});

		if (error) {
			throw error;
		}

		return data;
	}
};