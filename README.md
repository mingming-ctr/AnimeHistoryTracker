# AnimeEpisodeTracker

## 项目概述
这是一个 Chrome 扩展，用于跟踪用户观看的动漫集数。该扩展可以在用户观看动漫时自动保存观看历史，并在页面加载时显示当前集数。

## 简介
这是一个用于管理观看历史的应用程序，支持查询和清除记录，帮助用户追剧时不忘记观看到哪一集。

## 功能
- 保存观看历史: 在用户观看动漫时，自动保存标题、URL、集数和时间戳。
- 使用 IndexedDB: 采用 IndexedDB 存储观看历史数据，支持离线访问。
- 页面加载时显示当前集数: 在加载页面时，显示当前观看的动漫集数。
- 查询观看历史记录
- 清空所有记录
- 按时间倒序排列记录

## 文件结构
```
d:/temp/player/
├── Database.js      // 数据库相关操作
├── History.js       // 观看历史相关操作
├── WatchHistory.js   // 观看历史记录类
├── content.js       // 主逻辑
├── background.js    // 后台脚本
├── popup.js         // 弹出界面逻辑
└── utils.js         // 工具函数
```

## 使用说明
1. 打开应用程序。
2. 输入查询条件以搜索观看历史。
3. 点击清空按钮以删除所有记录。
4. 打开支持的动漫页面，扩展将自动记录观看历史。
5. 点击扩展图标查看当前观看的集数。

## 查看数据库的方法
由于 Chrome 插件的限制，有时无法通过常规的方式（如从 Service Worker 定位到控制台）查看 IndexedDB 数据库。这可能是 Chrome 的一个已知问题，尤其是在插件环境中。以下是推荐的查看方法：

1. **通过 1st-party 页面访问数据库：**
   - 打开扩展程序操作的页面（即支持记录的动漫页面）。
   - 按 `F12` 或右键选择“检查”打开开发者工具。
   - 进入“控制台”标签页，手动输入以下代码以查看数据库内容：
     ```javascript
     const request = indexedDB.open('你的数据库名称');
     request.onsuccess = function(event) {
         const db = event.target.result;
         const transaction = db.transaction(['你的对象存储名称'], 'readonly');
         const store = transaction.objectStore('你的对象存储名称');
         const allRecords = store.getAll();
         allRecords.onsuccess = function() {
             console.log(allRecords.result);
         };
     };
     ```

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证
本项目采用 MIT 许可证。
