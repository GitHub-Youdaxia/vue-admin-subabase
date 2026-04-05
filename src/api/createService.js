import { supabase } from "@/utils/supabase.js";

// 创建服务的公共方法
export function createService(tableName) {
	return {
		// 分页查询
		async queryAll() {
			let request = supabase.from(tableName).select("*", { count: "exact" });
			const { data, error, count } = await request;
			if (error) {
				throw error;
			}
			return {
				list: data || [],
				pagination: {
					total: count || 0,
					page: 1,
					size: 10
				}
			};
		},
		// 分页查询
		async page(params) {
			const page = params.page || 1;
			const size = params.size || 10;
			const { sortField, sortOrder, ...query } = params;

			let request = supabase.from(tableName).select("*", { count: "exact" });

			// 构建查询条件
			for (const [key, value] of Object.entries(query)) {
				if (value !== undefined && value !== null && value !== "") {
					// 跳过排序和分页相关的参数
					if (!key.startsWith("sort") && !key.includes("order") && !["page", "size"].includes(key)) {
						request = request.ilike(key, `%${value}%`);
					}
				}
			}

			// 排序
			if (sortField && sortOrder && typeof sortField === "string") {
				// 确保排序字段是有效的列名，移除可能的前缀
				const cleanSortField = sortField.replace(/^ilike\.\%/, "").replace(/^ilike\./, "");
				request = request.order(cleanSortField, { ascending: sortOrder === "asc" });
			}

			// 分页 - 使用基于0的索引
			const start = (page - 1) * size;
			const end = start + size - 1;
			request = request.range(start, end);

			const { data, error, count } = await request;

			if (error) {
				throw error;
			}

			return {
				list: data || [],
				pagination: {
					total: count || 0,
					page,
					size
				}
			};
		},

		// 新增
		async add(data) {
			// 移除可能存在的id字段，避免主键冲突
			const { ...restData } = data;

			const { data: insertedData, error } = await supabase
				.from(tableName)
				.insert({
					...restData,
					createTime: new Date().toISOString(),
					updateTime: new Date().toISOString()
				})
				.select();

			if (error) {
				throw error;
			}

			// 返回新创建记录的id，符合@cool-vue/crud组件的要求
			return insertedData && insertedData[0] ? insertedData[0].id : null;
		},

		// 修改
		async update(params) {
			const { id, ...rest } = params;
			const { error } = await supabase
				.from(tableName)
				.update({
					...rest,
					updateTime: new Date().toISOString()
				})
				.eq("id", id);

			if (error) {
				throw error;
			}

			return true;
		},

		// 删除
		async delete(params) {
			const { ids } = params;
			const { error } = await supabase.from(tableName).delete().in("id", ids);

			if (error) {
				throw error;
			}

			return true;
		},

		// 详情
		async info(params) {
			const { id } = params;
			const { data, error } = await supabase.from(tableName).select("*").eq("id", id).single();

			if (error) {
				throw error;
			}

			return data;
		}
	};
}
