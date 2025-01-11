// Database.js
import { WatchHistoryRecord } from './WatchHistory.js';

class Database {
    constructor() {
        this.db = null;
        this.dbName = 'AnimeHistoryDB'; // 数据库名称
    }

    // 打开数据库的函数
    async openDatabase() {
        const request = indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('watchHistory')) {
                const objectStore = db.createObjectStore('watchHistory', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                objectStore.createIndex('timestampUTC8', 'timestampUTC8', { unique: false });
                console.log(`对象存储 ${objectStore.name} 已创建`);
            } else {
                console.log(`对象存储 watchHistory 已存在`);
            }
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log(`数据库 ${this.dbName} 已成功创建或打开`);
        };

        request.onerror = (event) => {
            console.error(`打开数据库时发生错误: ${event.target.error}`);
        };
    }

    // 打印数据库记录的函数
    async printDatabaseRecords() {
        const request = indexedDB.open(this.dbName, 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['watchHistory'], 'readonly');
            const objectStore = transaction.objectStore('watchHistory');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = () => {
                console.log('数据库名: AnimeHistoryDB');
                console.log('表结构: watchHistory');
                const records = getAllRequest.result;
                const lastTenRecords = records.slice(-10);
                console.log('最后10条记录:', lastTenRecords);
            };

            getAllRequest.onerror = (event) => {
                console.error('获取记录失败:', event.target.error);
            };
        };
    }

    // 保存观看历史的函数
    async saveWatchHistory(record) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                console.error('数据库尚未打开');
                reject('数据库尚未打开');
                return;
            }

            const transaction = this.db.transaction(['watchHistory'], 'readwrite');
            const objectStore = transaction.objectStore('watchHistory');

            const date = new Date();
            const offset = date.getTimezoneOffset() * 60 * 1000; // Get timezone offset in milliseconds
            const utc8Date = new Date(date.getTime() + offset + 8 * 60 * 60 * 1000); // Convert to UTC+8
            record.timestamp = date.toISOString(); // Automatically set the current timestamp
            record.timestampUTC8 = utc8Date.toISOString(); // Automatically set the current timestamp in UTC+8

            const episodeMatch = record.episode.match(/\d+/); // 提取集数中的数字
            record.episode = episodeMatch ? parseInt(episodeMatch[0]) : null; // 存储为数字

            const addRequest = objectStore.add(record);

            addRequest.onsuccess = () => {
                console.log("Item added to the object store:", record);
                resolve(record);
            };

            addRequest.onerror = () => {
                console.error("Error adding item:", addRequest.error);
                reject(addRequest.error);
            };
        });
    }
}

export const database = new Database();
