// popup.js

// 读取观看历史记录的函数
function loadWatchHistory() {
    const request = indexedDB.open('AnimeHistoryDB', 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['watchHistory'], 'readonly');
        const objectStore = transaction.objectStore('watchHistory');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            const records = getAllRequest.result;
            console.log('读取到的记录:', records);
            displayRecords(records); // 调用函数显示记录
        };

        getAllRequest.onerror = (event) => {
            console.error('获取记录失败:', event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error('数据库打开失败:', event.target.error);
    };
}

// 显示记录的函数
function displayRecords(records) {
    const historyList = document.getElementById('historyList'); // 假设你有一个列表来显示记录
    historyList.innerHTML = ''; // 清空现有内容

    // 使用 Map 存储每个动漫的最近观看记录
    const latestRecords = new Map();

    records.forEach(record => {
        // 只保留每个动漫最近观看的记录
        if (!latestRecords.has(record.title) || new Date(latestRecords.get(record.title).timestamp) < new Date(record.timestamp)) {
            latestRecords.set(record.title, record);
        }
    });

    // 将最新记录按时间倒序添加到列表中
    const sortedRecords = Array.from(latestRecords.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedRecords.forEach(record => {
        const listItem = document.createElement('li');

        // 创建包含动画片名称和集数的容器
        const recordContainer = document.createElement('div');
        recordContainer.style.display = 'flex';
        recordContainer.style.justifyContent = 'space-between';
        recordContainer.style.width = '100%';

        // 创建动画片名称元素
        const titleSpan = document.createElement('span');
        titleSpan.className = 'record-title';
        titleSpan.style.flex = '1'; // 使用 flex 布局
        titleSpan.textContent = record.title; // 设置动画片名称

        // 创建集数链接元素
        const episodeLink = document.createElement('a');
        episodeLink.className = 'record-episode';
        episodeLink.href = record.url; // 设置链接地址
        episodeLink.target = '_blank'; // 在新标签页中打开链接

        // 设置集数文本
        episodeLink.textContent = `第${record.episode}集`; // 设置集数

        // 将动画片名称和集数添加到容器中
        recordContainer.appendChild(titleSpan);
        recordContainer.appendChild(episodeLink);

        // 将容器添加到列表项中
        listItem.appendChild(recordContainer);
        historyList.appendChild(listItem);
    });
}

// 页面加载时读取历史记录
document.addEventListener('DOMContentLoaded', loadWatchHistory);
