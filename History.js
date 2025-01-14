import { db } from './Database.js';

/**
 * History 类负责管理观看历史记录的操作。
 */
export class History {
    /**
     * 记录观看历史。
     * @param {string} title - 动漫标题
     * @param {string} url - 动漫网址
     * @param {number} episode - 动漫集数
     */
    static async recordWatchHistory(title, url, episode) {
        const now = new Date();
        const options = { timeZone: 'Asia/Shanghai', hour12: false };
        const timestamp = now.toLocaleString('zh-CN', options); // 获取东8区时间

        const record = {
            title: title,
            url: url,
            episode: episode,
            timestamp: timestamp // 添加时间戳
        };

        return await db.addAnime(record); // 保存观看历史记录
    }
}