# 绑定 Gitee 和 GitHub 远程仓库

## 1. 添加远程仓库

```bash
# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/youhanghang/vue-admin-subabase/

# 添加 GitHub 远程仓库
git remote add github https://github.com/youhanghang/vue-admin-subabase/
```

## 2. 推送代码到两个仓库

```bash
# 推送到 Gitee
git push -u gitee main

# 推送到 GitHub
git push -u github main
```

## 3. 后续更新

每次修改代码后，执行以下命令同时推送到两个仓库：

```bash
# 添加修改的文件
git add .

# 提交代码
git commit -m "提交信息"

# 推送到 Gitee
git push gitee main

# 推送到 GitHub
git push github main
```

## 4. 查看远程仓库配置

```bash
git remote -v
```
