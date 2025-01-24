import { db } from './Database.js';
import { History } from './History.js';

// 在 background.js 的顶部导入 AnimeFetcher
import { AnimeFetcher } from './AnimeFetcher.js'; // 确保路径正确


/**
 * Background 脚本类，负责监听和处理来自其他脚本的消息。
 */
class Background {
    /**
     * 构造函数，初始化消息监听器。
     */
    constructor() {
        console.log('Background script is ready and listening for messages');
        this.init(); // 初始化消息监听器
        this.updateAllAnimeEpisodes();
    }

    /**
     * 初始化消息监听器。
     */
    init() {
        // 添加消息监听器
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('Received message in background:', request);
            this.handleMessage(request, sendResponse); // 处理接收到的消息
            return true; // 保持通道打开
        });
    }

    /**
     * 处理接收到的消息。
     * @param {object} request - 消息请求对象
     * @param {function} sendResponse - 响应消息的函数
     */
    async handleMessage(request, sendResponse) {

        // db.init();

        // 根据请求的动作执行相应的操作
        switch (request.action) {
            case 'recordWatchHistory':
                console.log('记录观看历史:', request);
                try {
                    await History.recordWatchHistory(request.title, request.url, request.episode); // 记录观看历史
                    sendResponse({ status: 'success', message: 'Watch history recorded!' });
                } catch (error) {
                    sendResponse({ status: 'error', message: error.message }); // 返回错误信息
                }
                break;

            default:
                sendResponse({ status: 'unknown action', message: 'No action found.' }); // 未知的动作
                break;
        }
    }

    /**
     * 获取最新动漫集的链接
     * @returns {Promise<void>}
     */
    async getLatestAnimeEpisode(url) {

        const animeFetcher = new AnimeFetcher(url); // 替换为实际 URL
        const latestEpisodeInfo = await animeFetcher.fetchLatestEpisode();

        console.log(`动漫名称: ${latestEpisodeInfo.title}`);
        console.log(`最新集数: ${latestEpisodeInfo.latestEpisodeNumber}`);
        console.log(`最新集链接: ${latestEpisodeInfo.latestEpisodeUrl}`);

        // 调用新添加的方法获取观看动漫记录，传入 title
        const watchAnimeRecords = await animeFetcher.fetchWatchAnimeRecords(latestEpisodeInfo.title);
        if (watchAnimeRecords.length > 0) {
            // 调用 addPropertiesToRecords 方法
            const updatedRecords = animeFetcher.addPropertiesToRecords(watchAnimeRecords, latestEpisodeInfo);
            console.log('更新后的观看动漫记录:', updatedRecords);
        } else {
            console.log('没有找到观看动漫记录');
        }
    }

      /**
     * 更新所有动漫的最新一集
     * @returns {Promise<void>}
     */
      async updateAllAnimeEpisodes() {
        try {
            // 获取唯一标题列表
            const uniqueUrls = await db.getUniqueUrls();
            console.log(uniqueUrls);

            // 遍历每个 URL 并更新最新一集
            for (const url of uniqueUrls) {  
                console.log(`Fetching latest episode from: ${url}`); // 添加此行          
                await this.getLatestAnimeEpisode(url);
            }
        } catch (error) {
            console.log('Error updating all anime episodes:', error);
            console.error('Error updating all anime episodes:', error);
        }
    }
}

// 创建 Background 类的实例并启动监听器
const background = new Background();