// WatchHistory.js
export class WatchHistoryRecord {
    constructor(title, url, episode) {
        this.title = title;
        this.url = url;
        this.episode = episode;
        this.timestamp = new Date().toISOString(); // 添加时间戳
    }
}
