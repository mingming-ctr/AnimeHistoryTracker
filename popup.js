import { db } from './Database.js'; // 导入 Database 单例
/**
 * Popup 类负责管理观看历史的显示和操作。
 */
class Popup {
    constructor() {
        // 可以在这里初始化任何需要的属性
    }
    // 加载观看历史
    async loadWatchHistory() {
        try {
            // 初始化数据库
            // await db.init();

            // 获取所有观看记录（假设有一个方法来获取所有记录）
            const allRecords = await db.getAllRecords(); // 需要在 Database.js 中实现这个方法


            // 过滤出唯一的动画片记录
            const uniqueAnimeRecords = this.filterUniqueAnimeRecords(allRecords);

            this.displayRecords(uniqueAnimeRecords); // 显示记录的函数
        } catch (error) {
            console.error('Error loading watch history:', error);
        }
    }
    /**
     * 过滤出唯一的动画片记录，保留最后一次播放的内容，并按时间倒序排序。
     * @param {Array} records - 所有观看记录
     * @returns {Array} - 过滤后的唯一动画片记录
     */
    filterUniqueAnimeRecords(records) {
        const uniqueRecords = {};

        records.forEach(record => {
            // 假设 record.title 是动画片的标题
            if (!uniqueRecords[record.title] || new Date(record.timestamp) > new Date(uniqueRecords[record.title].timestamp)) {
                uniqueRecords[record.title] = record; // 保留最后一次播放的记录
            }
        });

        // 将唯一记录转换为数组并按时间戳倒序排序
        return Object.values(uniqueRecords).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // 显示记录的函数
    displayRecords(records) {
        const recordsContainer = document.getElementById('historyList'); // 使用正确的 ID
        recordsContainer.innerHTML = ''; // 清空现有内容

        records.forEach(record => {
            const recordElement = document.createElement('div');
            const episodeLink = document.createElement('a');
            episodeLink.href = record.url; // 设置链接为动漫网址
            episodeLink.textContent = `第${record.episode}集`; // 设置链接文本为“第N集”
            episodeLink.target = '_blank'; // 在新标签页中打开链接

            recordElement.textContent = `${record.title} `; // 显示动漫标题
            recordElement.appendChild(episodeLink); // 将链接添加到记录元素中

            recordsContainer.appendChild(recordElement); // 将记录元素添加到容器中
        });

    }
}

// 实例化 Popup 类并加载观看历史
const popup = new Popup();
popup.loadWatchHistory();