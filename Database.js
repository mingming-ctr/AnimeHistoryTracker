// Database.js
import { WatchHistoryRecord } from './WatchHistory.js';

let db;
const dbName = 'AnimeHistoryDB'; // 数据库名称

// 打开数据库的函数
export async function openDatabase() {
    // 打开数据库
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        // 如果对象存储不存在，则创建它
        if (!db.objectStoreNames.contains('watchHistory')) {
            const objectStore = db.createObjectStore('watchHistory', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('timestamp', 'timestamp', { unique: false }); // Create an index for timestamp
            objectStore.createIndex('timestampUTC8', 'timestampUTC8', { unique: false }); // Create an index for timestamp in UTC+8
            console.log(`对象存储 ${objectStore.name} 已创建`);
        } else {
            console.log(`对象存储 watchHistory 已存在`);
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log(`数据库 ${dbName} 已成功创建或打开`);
    };

    request.onerror = function(event) {
        console.error(`打开数据库时发生错误: ${event.target.error}`);
    };
}

// 打印数据库记录的函数
async function printDatabaseRecords() {
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['watchHistory'], 'readonly');
        const objectStore = transaction.objectStore('watchHistory');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            console.log('数据库名: AnimeHistoryDB'); 
            console.log('表结构: watchHistory');
            // 只打印后面10条记录
            const records = getAllRequest.result;
            const lastTenRecords = records.slice(-10);
            console.log('最近10条记录:', lastTenRecords);
        };

        getAllRequest.onerror = (event) => {
            console.error('获取记录失败:', event.target.error);
        };
    };
}

// 保存观看历史的函数
export async function saveWatchHistory(record) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1); // 确保数据库名称一致

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['watchHistory'], 'readwrite');
            const objectStore = transaction.objectStore('watchHistory');

            // 直接使用 record 对象添加到对象存储，无需 id
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
        };

        request.onerror = (event) => {
            console.error(`打开数据库时发生错误: ${event.target.error}`);
            reject(event.target.error);
        };
    });
}
