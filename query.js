class Query {
    constructor() {
        this.dbName = 'AnimeHistoryDB';
        this.dbRequest = indexedDB.open(this.dbName, 1);
        this.dbRequest.onsuccess = (event) => {
            this.db = event.target.result;
            this.displayRecords();
        };

        this.dbRequest.onupgradeneeded = (event) => {
            this.db = event.target.result;
            this.db.createObjectStore('watchHistory', { keyPath: 'id', autoIncrement: true });
        };
    }

    displayRecords() {
        const transaction = this.db.transaction(['watchHistory'], 'readonly');
        const objectStore = transaction.objectStore('watchHistory');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            const records = getAllRequest.result;
            const sortedRecords = records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            const recordList = document.getElementById('recordList');
            recordList.innerHTML = '';

            sortedRecords.forEach(record => {
                const listItem = document.createElement('li');
                listItem.className = 'record-item';
                const formattedTimestamp = new Date(record.timestamp).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                const formattedEpisode = record.episode.toString().padStart(3, '0');
                listItem.innerHTML = `<span class='record-title'>标题: ${record.title}</span> <span class='record-episode'>集数: ${formattedEpisode}</span> <span class='record-url'>网址: <a href='${record.url}' target='_blank'>${record.url}</a></span> <span class='record-timestamp'>${formattedTimestamp}</span> <button class='delete-button'>删除</button>`;
                const deleteButton = listItem.querySelector('.delete-button');
                deleteButton.onclick = () => this.queryDeleteRecord(record.id);
                recordList.appendChild(listItem);
            });
        };
    }

    queryDeleteRecord(id) {
        const transaction = this.db.transaction(['watchHistory'], 'readwrite');
        const objectStore = transaction.objectStore('watchHistory');
        objectStore.delete(id).onsuccess = () => {
            this.displayRecords();
        };
    }

    queryRecords() {
        const query = document.getElementById('search').value.toLowerCase();
        console.log("Searching for:", query); // 输出查询内容
        const transaction = this.db.transaction(['watchHistory'], 'readonly');
        const objectStore = transaction.objectStore('watchHistory');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            const records = getAllRequest.result;
            console.log("Records found:", records); // 输出找到的记录
            const filteredRecords = records.filter(record => 
                record.title.toLowerCase().includes(query) ||
                record.url.toLowerCase().includes(query) ||
                record.episode.toString().toLowerCase().includes(query) // 将数字转换为字符串
            );

            console.log("Filtered records:", filteredRecords); // 输出过滤后的记录

            const recordList = document.getElementById('recordList');
            recordList.innerHTML = '';
            filteredRecords.forEach(record => {
                const listItem = document.createElement('li');
                listItem.className = 'record-item'; // 添加类名以应用样式
                const formattedTimestamp = new Date(record.timestamp).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); // 格式化时间
                const formattedEpisode = record.episode.toString().padStart(3, '0'); // 确保集数显示为三位数
                listItem.innerHTML = `<span class='record-title'>${record.title}</span> <span class='record-episode'>集数: ${formattedEpisode}</span> <span class='record-url'>网址: <a href='${record.url}' target='_blank'>${record.url}</a></span> <span class='record-timestamp'>${formattedTimestamp}</span> <button class='delete-button'>删除</button>`;
                const deleteButton = listItem.querySelector('.delete-button');
                deleteButton.onclick = () => this.queryDeleteRecord(record.id);
                recordList.appendChild(listItem);
            });
        };
    }
}

const query = new Query();

document.addEventListener('DOMContentLoaded', function() {
    // 绑定搜索事件
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', () => query.queryRecords());
    } else {
        console.error('Search input with id "search" not found.');
    }
});

document.getElementById('clearAll').onclick = function() {
    console.log('清空所有记录按钮被点击'); // 调试信息
    const transaction = query.db.transaction(['watchHistory'], 'readwrite');
    const objectStore = transaction.objectStore('watchHistory');

    const clearRequest = objectStore.clear();
    clearRequest.onsuccess = function() {
        console.log('所有记录已清空');
        // 这里可以添加更新 UI 的代码，例如重新加载记录
        query.displayRecords(); // 重新显示记录
    };
    clearRequest.onerror = function() {
        console.error('清空记录时出错');
    };
};
