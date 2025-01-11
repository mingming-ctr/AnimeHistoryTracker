// popup.js

class Popup {
    constructor() {
        this.dbName = 'AnimeHistoryDB';
        document.addEventListener('DOMContentLoaded', this.loadWatchHistory.bind(this));
    }

    loadWatchHistory() {
        const request = indexedDB.open(this.dbName, 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['watchHistory'], 'readonly');
            const objectStore = transaction.objectStore('watchHistory');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = () => {
                const records = getAllRequest.result;
                console.log('读取到的记录:', records);
                this.displayRecords(records);
            };

            getAllRequest.onerror = (event) => {
                console.error('获取记录失败:', event.target.error);
            };
        };

        request.onerror = (event) => {
            console.error('数据库打开失败:', event.target.error);
        };
    }

    displayRecords(records) {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';

        const latestRecords = new Map();

        records.forEach(record => {
            if (!latestRecords.has(record.title) || new Date(latestRecords.get(record.title).timestamp) < new Date(record.timestamp)) {
                latestRecords.set(record.title, record);
            }
        });

        const sortedRecords = Array.from(latestRecords.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        sortedRecords.forEach(record => {
            const listItem = document.createElement('li');

            const recordContainer = document.createElement('div');
            recordContainer.style.display = 'flex';
            recordContainer.style.justifyContent = 'space-between';
            recordContainer.style.width = '100%';

            const titleSpan = document.createElement('span');
            titleSpan.className = 'record-title';
            titleSpan.style.flex = '1'; 
            titleSpan.textContent = record.title; 

            const episodeLink = document.createElement('a');
            episodeLink.className = 'record-episode';
            episodeLink.href = record.url; 
            episodeLink.target = '_blank'; 

            episodeLink.textContent = `第${record.episode}集`; 

            recordContainer.appendChild(titleSpan);
            recordContainer.appendChild(episodeLink);

            listItem.appendChild(recordContainer);
            historyList.appendChild(listItem);
        });
    }
}

const popup = new Popup();
