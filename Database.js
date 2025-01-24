import IndexedDBHelper from './IndexedDBHelper.js'; // 确保路径正确

class Database {
    // 声明常量
    static DB_NAME = 'AnimeHistoryDB'; // 数据库名称
    static STORE_NAME = 'watchHistory'; // 对象存储名称

    // 单例实例
    static instance = null;

    constructor() {
        if (Database.instance) {
            return Database.instance; // 如果实例已存在，返回现有实例
        }

        this.dbHelper = new IndexedDBHelper(Database.DB_NAME, 1);
        // this.init();这里不能用，因为实例还未初始化，他是在构造函数里面
        Database.instance = this; // 设置单例实例
    }

    // 初始化数据库
    async init() {
        try {
            await this.dbHelper.openDatabase(Database.STORE_NAME);
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    }

    // 添加动漫数据
    async addAnime(animeData) {
        try {
            await this.init();
            const message = await this.dbHelper.addData(Database.STORE_NAME, animeData);
            console.log(message);
        } catch (error) {
            console.error('Error adding anime:', error);
        }
    }

    // 获取动漫数据
    async getAnime(id) {
        try {
            await this.init();
            const data = await this.dbHelper.getData(Database.STORE_NAME, id);
            console.log('Retrieved anime data:', data);
            return data;
        } catch (error) {
            console.error('Error getting anime:', error);
        }
    }

    // 更新动漫数据
    async updateAnime(animeData) {
        try {
            await this.init();
            const message = await this.dbHelper.updateData(Database.STORE_NAME, animeData);
            console.log(message);
        } catch (error) {
            console.error('Error updating anime:', error);
        }
    }

    // 删除动漫数据
    async deleteAnime(id) {
        try {
            await this.init();
            const message = await this.dbHelper.deleteData(Database.STORE_NAME, id);
            console.log(message);
        } catch (error) {
            console.error('Error deleting anime:', error);
        }
    }

    // 获取所有记录
    async getAllRecords() {
        // 示例调用
        await this.init();
        const records = await this.dbHelper.getAllRecords(Database.STORE_NAME); // 传递 STORE_NAME
        return records;
    }

    // 清空所有记录
    async clearAllRecords() {

        await this.init();
        return await this.dbHelper.clearAllRecords(Database.STORE_NAME); // 传递 STORE_NAME
    }

    async getUniqueTitles() {
        try {
            const records = await this.getAllRecords(); // 获取所有记录
            const uniqueTitles = new Set(); // 使用 Set 来去重

            records.forEach(record => {
                if (record.title) {
                    // 假设 title 是包含 URL 的字段
                    uniqueTitles.add(record.title); // 将格式化后的 URL 添加到 Set
                }
            });

            return Array.from(uniqueTitles); // 返回去重后的数组
        } catch (error) {
            console.error('Error fetching unique titles:', error);
            throw error; // 重新抛出错误以便上层处理
        }
    }

    async getUniqueUrls() {
        try {
            const records = await this.getAllRecords(); // 获取所有记录
            const uniqueUrls = new Set(); // 使用 Set 来去重

            records.forEach(record => {
                if (record.url) { // 确保记录中有 url 字段
                    let url = record.url; // 直接读取 url 字段
                    // 替换 'dongmanplay' 为 'dongman'
                    url = url.replace('dongmanplay', 'dongman');
                    // 使用正则表达式去掉 -1-154 这样的部分
                    const formattedUrl = url.replace(/(-\d+-\d+\.html)$/, '.html');
                    uniqueUrls.add(formattedUrl); // 将格式化后的 URL 添加到 Set
                }
            });

            return Array.from(uniqueUrls); // 返回去重后的 URL 数组
        } catch (error) {
            console.error('Error fetching unique URLs:', error);
            throw error; // 重新抛出错误以便上层处理
        }
    }

}

// 导出 Database 单例，名称为 db
const db = new Database();
// await db.init();
export { db };
