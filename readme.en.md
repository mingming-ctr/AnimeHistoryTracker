# AnimeEpisodeTracker

## Project Overview
This is a Chrome extension designed to track the episodes of anime series a user has watched. The extension automatically saves the viewing history as users watch anime, and displays the current episode number when the page loads.

## Introduction
This application is designed to manage the viewing history of anime series, supporting the querying and clearing of records to help users keep track of which episode they were last watching.

## Features
- **Save Viewing History**: Automatically saves the title, URL, episode number, and timestamp when a user watches an anime.
- **IndexedDB Storage**: Uses IndexedDB to store the viewing history, supporting offline access.
- **Display Current Episode on Page Load**: Shows the current anime episode number when the page is loaded.
- **Query Viewing History**: Allows users to query their viewing history.
- **Clear All Records**: Clears all stored history.
- **Sort by Timestamp**: Records are sorted in reverse chronological order.

## File Structure
Current Directory.
```
├── background.js        // 后台脚本
├── content.js           // 主逻辑
├── Database.js          // 数据库相关操作
├── History.js           // 观看历史相关操作
├── IndexedDBHelper.js   // IndexedDB 操作的辅助类
├── manifest.json        // 扩展程序的清单文件
├── popup.html           // 弹出界面的 HTML 文件
├── popup.js             // 弹出界面逻辑
├── push.ps1             // PowerShell 脚本
├── query.html           // 查询界面的 HTML 文件
├── query.js             // 处理查询逻辑
├── readme.en.md        // 英文 README 文件
└── README.md            // 项目的 README 文件
└── images               // 存放图标的文件夹
    ├── icon128.png     // 128x128 图标
    ├── icon16.png      // 16x16 图标
    └── icon48.png      // 48x48 图标
```


## Usage Instructions
1. Open the application.
2. Enter query conditions to search the viewing history.
3. Click the "Clear" button to delete all records.
4. Open a supported anime page, and the extension will automatically record your viewing history.
5. Click the extension icon to view the current episode.

## How to View the Database
Due to Chrome extension limitations, you may not always be able to view the IndexedDB database in the usual way (e.g., accessing it through the Service Worker console). This may be a known issue with Chrome, especially in the extension environment. The recommended way to view the database is as follows:

1. **Access the Database through the 1st-party page:**
   - Open the page that the extension interacts with (i.e., a supported anime page).
   - Press `F12` or right-click and choose "Inspect" to open the Developer Tools.
   - Go to the "Console" tab and manually input the following code to view the database contents:
     ```javascript
     const request = indexedDB.open('YourDatabaseName');
     request.onsuccess = function(event) {
         const db = event.target.result;
         const transaction = db.transaction(['YourObjectStoreName'], 'readonly');
         const store = transaction.objectStore('YourObjectStoreName');
         const allRecords = store.getAll();
         allRecords.onsuccess = function() {
             console.log(allRecords.result);
         };
     };
     ```

We welcome contributions in any form! Please submit issues or pull requests.

## License
This project is licensed under the MIT License.
