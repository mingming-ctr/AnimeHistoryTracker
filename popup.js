// popup.js

/**
 * Popup 类，负责加载和显示历史记录
 */
class Popup {
    /**
     * 构造函数，初始化数据库名称和事件监听
     */
    constructor() {
        this.dbName = 'AnimeHistoryDB'; // 数据库名称
        document.addEventListener('DOMContentLoaded', this.loadWatchHistory.bind(this)); // 绑定 DOMContentLoaded 事件以加载历史记录
    }

    /**
     * 加载历史记录
     */
    loadWatchHistory() {
        const request = indexedDB.open(this.dbName, 1); // 打开数据库

        request.onsuccess = (event) => {
            const db = event.target.result; // 获取数据库对象
            const transaction = db.transaction(['watchHistory'], 'readonly'); // 创建只读事务
            const objectStore = transaction.objectStore('watchHistory'); // 获取对象存储
            const getAllRequest = objectStore.getAll(); // 获取所有记录

            getAllRequest.onsuccess = () => {
                const records = getAllRequest.result; // 获取读取到的记录
                console.log('读取到的记录:', records); // 输出读取到的记录
                this.displayRecords(records); // 显示读取到的记录
            };

            getAllRequest.onerror = (event) => {
                console.error('获取记录失败:', event.target.error); // 输出获取记录失败的错误
            };
        };

        request.onerror = (event) => {
            console.error('数据库打开失败:', event.target.error); // 输出数据库打开失败的错误
        };
    }

    /**
     * 显示历史记录
     * @param {Array} records 历史记录数组
     */
    displayRecords(records) {
        const historyList = document.getElementById('historyList'); // 获取历史记录列表元素
        historyList.innerHTML = ''; // 清空历史记录列表

        const latestRecords = new Map(); // 使用 Map 存储每个动漫的最近观看记录

        records.forEach(record => {
            if (!latestRecords.has(record.title) || new Date(latestRecords.get(record.title).timestamp) < new Date(record.timestamp)) {
                latestRecords.set(record.title, record); // 只保留每个动漫最近观看的记录
            }
        });

        const sortedRecords = Array.from(latestRecords.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // 按时间倒序排列

        sortedRecords.forEach(record => {
            const listItem = document.createElement('li'); // 创建列表项元素
            const recordContainer = document.createElement('div'); // 创建记录容器元素
            recordContainer.style.display = 'flex'; // 设置容器显示样式
            recordContainer.style.justifyContent = 'space-between'; // 设置容器内容对齐方式
            recordContainer.style.width = '100%'; // 设置容器宽度

            const titleSpan = document.createElement('span'); // 创建标题元素
            titleSpan.className = 'record-title'; // 设置标题类名
            titleSpan.style.flex = '1'; // 设置标题宽度
            titleSpan.textContent = record.title; // 设置动漫标题

            const episodeLink = document.createElement('a'); // 创建集数链接元素
            episodeLink.className = 'record-episode'; // 设置集数链接类名
            episodeLink.href = record.url; // 设置集数链接地址
            episodeLink.target = '_blank'; // 在新标签页中打开链接
            episodeLink.textContent = `第${record.episode}集`; // 设置集数

            recordContainer.appendChild(titleSpan); // 将标题添加到容器
            recordContainer.appendChild(episodeLink); // 将集数链接添加到容器
            listItem.appendChild(recordContainer); // 将容器添加到列表项
            historyList.appendChild(listItem); // 将记录添加到历史记录列表
        });
    }
}

const popup = new Popup(); // 创建 Popup 类的实例并加载历史记录
