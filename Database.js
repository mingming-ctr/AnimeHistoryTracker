// Database.js
import { WatchHistoryRecord } from './WatchHistory.js';

/**
 * Database 类负责管理 IndexedDB 数据库的创建、打开、读写操作。
 */
class Database {
    /**
     * 构造函数，初始化数据库名称和对象。
     */
    constructor() {
        this.db = null; // IndexedDB 数据库对象
        this.dbName = 'AnimeHistoryDB'; // 数据库名称
    }

    /**
     * 打开数据库的函数，如果数据库不存在则创建。
     */
    async openDatabase() {
        // indexedDB.open() 方法用于打开指定名称和版本的数据库
        const request = indexedDB.open(this.dbName, 1);

        /**
         * onupgradeneeded 事件处理函数，在数据库升级时触发。
         * 如果数据库不存在或版本号升级，则创建对象存储和索引。
         */
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('watchHistory')) {
                // 创建对象存储，指定主键和自动递增
                const objectStore = db.createObjectStore('watchHistory', { keyPath: 'id', autoIncrement: true });
                // 创建索引，指定属性和唯一性
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                objectStore.createIndex('timestampUTC8', 'timestampUTC8', { unique: false });
                console.log(`对象存储 ${objectStore.name} 已创建`);
            } else {
                console.log(`对象存储 watchHistory 已存在`);
            }
        };

        /**
         * onsuccess 事件处理函数，在数据库打开成功时触发。
         * 将数据库对象赋值给 this.db。
         */
        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log(`数据库 ${this.dbName} 已成功创建或打开`);
        };

        /**
         * onerror 事件处理函数，在数据库打开失败时触发。
         * 输出错误信息。
         */
        request.onerror = (event) => {
            console.error(`打开数据库时发生错误: ${event.target.error}`);
        };
    }

    /**
     * 打印数据库记录的函数，读取最后 10 条记录。
     */
    async printDatabaseRecords() {
        // indexedDB.open() 方法用于打开指定名称和版本的数据库
        const request = indexedDB.open(this.dbName, 1);

        /**
         * onsuccess 事件处理函数，在数据库打开成功时触发。
         * 读取对象存储中的所有记录，并输出最后 10 条记录。
         */
        request.onsuccess = (event) => {
            const db = event.target.result;
            // 创建事务，指定对象存储和读写模式
            const transaction = db.transaction(['watchHistory'], 'readonly');
            const objectStore = transaction.objectStore('watchHistory');
            // 获取所有记录
            const getAllRequest = objectStore.getAll();

            /**
             * onsuccess 事件处理函数，在获取记录成功时触发。
             * 输出数据库名、表结构和最后 10 条记录。
             */
            getAllRequest.onsuccess = () => {
                console.log('数据库名: AnimeHistoryDB');
                console.log('表结构: watchHistory');
                const records = getAllRequest.result;
                const lastTenRecords = records.slice(-10);
                console.log('最后10条记录:', lastTenRecords);
            };

            /**
             * onerror 事件处理函数，在获取记录失败时触发。
             * 输出错误信息。
             */
            getAllRequest.onerror = (event) => {
                console.error('获取记录失败:', event.target.error);
            };
        };
    }

    /**
     * 保存观看历史的函数，添加一条记录到对象存储。
     * @param {WatchHistoryRecord} record 观看历史记录
     */
    async saveWatchHistory(record) {
        // 创建事务，指定对象存储和读写模式
        const transaction = this.db.transaction(['watchHistory'], 'readwrite');
        const objectStore = transaction.objectStore('watchHistory');
        // 添加记录
        const request = objectStore.add(record);

        /**
         * onsuccess 事件处理函数，在添加记录成功时触发。
         * 输出成功信息。
         */
        request.onsuccess = () => {
            console.log('观看历史记录已保存');
        };

        /**
         * onerror 事件处理函数，在添加记录失败时触发。
         * 输出错误信息。
         */
        request.onerror = (event) => {
            console.error('保存观看历史记录时发生错误:', event.target.error);
        };
    }
}

// 导出 Database 实例
export const database = new Database();
