# 阿金便利贴 · NoteFlow

把待办、灵感和日常提醒贴在电脑桌面。自由选择主题、字体和贴纸，让每张便签都有自己的样子。

## 下载电脑端

**[下载安装包 · 1.15.0（Windows 64 位）](https://github.com/jin345764-boop/noteflow-desktop-notes/releases/download/v1.15.0/NoteFlow_1.15.0_x64-setup.exe)**

[查看版本与更新说明](https://github.com/jin345764-boop/noteflow-desktop-notes/releases/latest)

下载后双击安装包，按提示安装并启动。当前提供 Windows 64 位安装包，需要 WebView2 运行环境；其他系统的安装包尚未提供。

## 能做什么

- **桌面便签**：便签直接放在电脑桌面，自由拖动、调整大小、锁定位置。
- **主题与字体**：多种场景主题、手写字体和其他字体，支持自定义颜色、圆角与透明度。
- **贴纸与标题**：趣味贴纸、文字标题和可编辑气泡，保持简洁，也能表达心情。
- **框选与排列**：点击控制条的“框选”，拖动选框后，拖动任一选中便签的标题即可一起移动。Shift 追加选择，Esc 退出，锁定便签保持原位；“紧凑对齐”帮助整理布局。
- **待办进度**：勾选事项后展示完成进度。全部完成会出现猫爪“已完成”印章、彩带和音效；点击循环图标可重置完成状态，保留原文字，方便第二天继续使用。
- **番茄钟**：选择便签和具体事项，设置专注时长，查看倒计时和进度。完成操作只作用于所选事项。
- **专注概览与记录**：记录项目、具体事项、时间与时长，提供概览和条形记录，记录可删除，新用户从空记录开始。
- **本地保存**：便签、布局、设置、归档和专注记录保存在本机，重启后继续使用。

## 1.15.0 更新

- 恢复原版应用图标。
- 控制条增加“框选”入口。
- 增加清晰的选中描边，处理快速框选。
- 多张选中便签保持相对位置一起移动，锁定便签不移动。

## 开发与构建

项目使用 React、TypeScript、Vite 和 Tauri。安装 Node.js 与 Rust；在 Windows 上构建桌面安装包还需要 Microsoft C++ Build Tools 和 WebView2。

```bash
npm ci
npm run dev          # 网页预览
npm run tauri dev    # 桌面开发
npm run lint        # 类型检查
npm run tauri build  # 构建桌面安装包
```

安装包输出到 `src-tauri/target/release/bundle/nsis/`。更多操作与开发说明见 [WINDOWS.md](WINDOWS.md)。
