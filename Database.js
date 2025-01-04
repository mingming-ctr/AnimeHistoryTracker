// Database.js
import { WatchHistoryRecord } from './WatchHistory.js';

let db;

// 打开数据库的函数
export async function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('AnimeHistoryDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // 创建对象存储
            const objectStore = db.createObjectStore('watchHistory', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('title', 'title', { unique: false });
            objectStore.createIndex('url', 'url', { unique: false });
            objectStore.createIndex('episode', 'episode', { unique: false });
        };

        request.onsuccess = () => {
            console.log('数据库打开成功');
            // 打印表和记录
            printDatabaseRecords();
            resolve();
        };

        request.onerror = (event) => {
            console.error('数据库打开失败:', event.target.error);
            reject(new Error('数据库打开失败'));
        };
    });
}

// 打印数据库记录的函数
async function printDatabaseRecords() {
    const request = indexedDB.open('AnimeHistoryDB', 1);

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
        const request = indexedDB.open('AnimeHistoryDB', 1); // 确保数据库名称一致

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['watchHistory'], 'readwrite');
            const objectStore = transaction.objectStore('watchHistory');

            // 为记录添加时间戳，并将集数转换为数字
            const recordWithTimestamp = {
                title: record.title,
                url: record.url,
                episode: parseInt(record.episode.replace(/第|集/g, ''), 10), // 去掉“第”和“集”，并转换为数字
                timestamp: new Date().toISOString() // 添加当前时间戳
            };

            const addRequest = objectStore.add(recordWithTimestamp);

            addRequest.onsuccess = () => {
                console.log('观看历史已保存:', recordWithTimestamp);
                resolve();
            };

            addRequest.onerror = (event) => {
                console.error('保存观看历史失败:', event.target.error);
                reject(new Error('保存观看历史失败'));
            };
        };

        request.onerror = (event) => {
            console.error('数据库打开失败:', event.target.error);
            reject(new Error('数据库打开失败'));
        };
    });
}
