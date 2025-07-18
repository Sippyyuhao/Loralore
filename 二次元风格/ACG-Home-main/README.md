# 二次元个人主页模板

这是一个精致、高度可定制的纯静态二次元风格个人主页模板。它具有动态背景、飘落的樱花特效、响应式布局、可切换的主题以及一个功能齐全的音乐播放器。

## 如何使用

直接在浏览器中打开 `index.html` 文件即可本地预览。为了获得最佳体验（特别是解决本地图片加载的CORS问题），建议通过本地服务器（如 VS Code 的 "Live Server" 扩展）来查看。

## 如何自定义

大部分的自定义操作都在 `index.html` 文件中完成，无需复杂的编程知识。

### 1. 修改基本信息

直接在 `index.html` 的相应部分修改文本即可：

-   **网站标题**: 修改 `<h2 class="name">网站标题</h2>`
-   **社交链接**: 在 `.social-icons` 部分，修改 `<a>` 标签的 `href` 属性，并可以更改 `<i>` 标签来更换图标 (图标来自 Font Awesome)。
-   **关于我/我的作品/公告**: 直接修改对应的 `<p>` 或 `<h3>` 标签中的文本内容。

### 2. 如何添加或修改歌曲

音乐播放器的歌曲列表是完全可定制的。

1.  **准备文件**:
    *   将你的歌曲文件 (例如, `song3.mp3`) 放入 `assets/music/` 文件夹。
    *   将对应的专辑封面图片 (例如, `cover3.jpg`) 放入 `assets/images/covers/` 文件夹。

2.  **修改播放列表**:
    *   打开 `index.html` 文件，滚动到底部的 `<script>` 区域。
    *   找到名为 `playlist` 的常量数组。
    *   在数组中，每个 `{}` 都代表一首歌。要添加新歌，只需仿照现有格式添加一个新的对象即可。

**示例**:

假设你要添加一首新歌，`song3.mp3` 和 `cover3.jpg`。

```javascript
// ...
                const playlist = [
                    {
                        title: "Bravely You",
                        artist: "Lia",
                        src: "./assets/music/song1.mp3",
                        cover: "./assets/images/covers/cover1.jpg"
                    },
                    {
                        title: "My Soul, Your Beats!",
                        artist: "Lia",
                        src: "./assets/music/song2.mp3",
                        cover: "./assets/images/covers/cover2.jpg"
                    },
                    // 在这里添加你的新歌
                    {
                        title: "你的歌曲名称",
                        artist: "歌手名",
                        src: "./assets/music/song3.mp3",
                        cover: "./assets/images/covers/cover3.jpg"
                    }
                ];
// ...
```

你可以按此格式添加任意数量的歌曲。删除歌曲只需移除对应的 `{...}` 对象即可。

### 3. 如何更换背景图片

背景图片是自动轮播的。

1.  **准备文件**: 将你的背景图片放入 `assets/images/backgrounds/page-head/` 文件夹。
2.  **修改图片列表**:
    *   在 `index.html` 的 `<script>` 区域中，找到名为 `images` 的常量数组。
    *   修改数组中的图片路径为你自己的图片路径。

```javascript
// ...
                const images = [
                    './assets/images/backgrounds/page-head/your-image-1.jpg',
                    './assets/images/backgrounds/page-head/your-image-2.jpg',
                    './assets/images/backgrounds/page-head/your-image-3.jpg'
                ];
// ...
```

### 4. 主题颜色定制

你可以在 `assets/styles/index.css` 文件的 `:root` 选择器中直接修改两个主题的颜色变量，以创建完全属于你自己的配色方案。

---
祝你使用愉快！ 