// History.js
import { saveWatchHistory } from './Database.js';

// 处理记录观看历史的函数
export function recordWatchHistory(title, url, episode) {
    const record = {
        title: title,
        url: url,
        episode: episode
    };
    return saveWatchHistory(record);
}
