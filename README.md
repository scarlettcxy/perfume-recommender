# 气味索引

一个中文香水推荐网站 MVP。首页通过下拉菜单选择主要香材、香调分类和风格标签，点击搜索后进入结果页，再进入香水详情页。

## 本地预览

```bash
pnpm install
pnpm dev
```

打开：

```text
http://127.0.0.1:5173/#/
```

## 数据维护

香水数据在：

```text
src/data/perfumes.json
```

维护说明在：

```text
src/data/README.md
```

新增香水后建议运行：

```bash
pnpm validate:data
pnpm build
```

## 公开上线

推荐使用 Vercel，最省事：

1. 把这个文件夹上传到 GitHub 仓库。
2. 打开 Vercel，选择 `New Project`。
3. 导入这个 GitHub 仓库。
4. Framework Preset 选择 `Vite`。
5. Build Command 使用 `pnpm build`。
6. Output Directory 使用 `dist`。
7. 点击 Deploy。

部署完成后，Vercel 会给一个公网网址，任何人都可以打开。

也可以使用 Netlify：

1. 把这个文件夹上传到 GitHub 仓库。
2. 打开 Netlify，选择 `Add new site`。
3. 导入 GitHub 仓库。
4. Build command 使用 `pnpm build`。
5. Publish directory 使用 `dist`。
6. 点击 Deploy。
