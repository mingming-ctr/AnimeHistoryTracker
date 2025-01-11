// History.js
import { saveWatchHistory } from './Database.js';

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
        const record = {
            title: title,
            url: url,
            episode: episode
        };
        return await saveWatchHistory(record); // 保存观看历史记录
    }
}
