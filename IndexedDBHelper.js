// indexdbHelper.js

class IndexedDBHelper {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    // 打开或创建数据库
    openDatabase(storeName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject('Database error: ' + event.target.errorCode);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.createObjectStore(db, storeName);
            };
        });
    }

    // 创建对象存储
    createObjectStore(db, storeName) {
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id',autoIncrement: true });
        }
    }

    // 添加数据
    addData(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            console.log("准备添加记录：",storeName, data);
            const request = store.add(data);

            request.onsuccess = () => {
                resolve('Data added successfully');
            };

            request.onerror = (event) => {
                reject('Error adding data: ' + event.target.errorCode);
            };
        });
    }

    // 获取数据
    getData(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject('Error getting data: ' + event.target.errorCode);
            };
        });
    }
    // 获取所有记录
    getAllRecords(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject('Error getting all records: ' + event.target.error);
            };
        });
    }

    // 删除数据
    deleteData(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve('Data deleted successfully');
            };

            request.onerror = (event) => {
                reject('Error deleting data: ' + event.target.errorCode);
            };
        });
    }
    // 清空所有记录
    async clearAllRecords(objectStoreName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([objectStoreName], 'readwrite');
            const objectStore = transaction.objectStore(objectStoreName);
            const clearRequest = objectStore.clear();

            clearRequest.onsuccess = () => {
                resolve('所有记录已清空');
            };

            clearRequest.onerror = (event) => {
                reject('清空记录时出错: ' + event.target.errorCode);
            };
        });
    }


    // 更新数据
    updateData(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => {
                resolve('Data updated successfully');
            };

            request.onerror = (event) => {
                reject('Error updating data: ' + event.target.errorCode);
            };
        });
    }
}

export default IndexedDBHelper;