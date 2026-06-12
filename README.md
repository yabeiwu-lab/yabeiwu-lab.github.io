# 课题组网站

基于 HugoBlox Research Group 模板构建的中文科研课题组网站。

## 本地预览

```bash
cd research-group-website
hugo server
```

浏览器访问 <http://localhost:1313/>。修改 Markdown 或 YAML 文件后，页面会自动刷新。

## 常用修改位置

- 网站名称和网址：`config/_default/hugo.yaml`
- 导航菜单：`config/_default/menus.yaml`
- 页脚、SEO、搜索等：`config/_default/params.yaml`
- 首页：`content/_index.md`
- 研究方向：`content/research/index.md`
- 联系与加入我们：`content/contact/index.md`
- 科研项目：`content/projects/index.md`
- 负责人资料：`content/authors/admin/_index.md`
- 负责人照片：`content/authors/admin/avatar.jpg`
- 首页图片：`assets/media/welcome.jpg`

## 添加成员

复制 `content/authors/admin/` 目录并改为成员英文名或拼音，例如：

```text
content/authors/zhang-san/
├── _index.md
└── avatar.jpg
```

编辑 `_index.md`，将 `superuser` 设置为 `false`，并将 `user_groups` 设置为以下分组之一：

```yaml
user_groups:
  - 博士研究生
```

可用分组包括：`课题组负责人`、`教师`、`博士后`、`博士研究生`、`硕士研究生`、`本科生`、`往届成员`。

## 添加新闻

复制 `content/post/dielectric-sisso/` 目录并改成新的英文或拼音名称，然后修改其中的 `index.md`。如需新闻配图，在目录中添加 `featured.jpg`。

## 添加论文

在 `content/publication/` 下为每篇论文新建目录及 `index.md`。也可以使用 HugoBlox 提供的 BibTeX 导入工作流。

## 构建与部署

```bash
hugo --minify
```

构建结果位于 `public/`。仓库已包含 `.github/workflows/publish.yaml`，推送到 GitHub 后可使用 GitHub Pages 自动部署。
