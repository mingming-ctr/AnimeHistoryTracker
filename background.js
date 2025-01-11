import { openDatabase } from './Database.js';
import { recordWatchHistory } from './History.js';

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
        // 根据请求的动作执行相应的操作
        switch (request.action) {
            case 'openDatabase':
                try {
                    await openDatabase(); // 打开数据库
                    sendResponse({status: 'success', message: 'Database opened!'});
                } catch (error) {
                    sendResponse({status: 'error', message: error.message}); // 返回错误信息
                }
                break;

            case 'recordWatchHistory':
                console.log('记录观看历史:', request);
                try {
                    await recordWatchHistory(request.title, request.url, request.episode); // 记录观看历史
                    sendResponse({status: 'success', message: 'Watch history recorded!'});
                } catch (error) {
                    sendResponse({status: 'error', message: error.message}); // 返回错误信息
                }
                break;

            default:
                sendResponse({status: 'unknown action', message: 'No action found.'}); // 未知的动作
                break;
        }
    }
}

// 创建 Background 类的实例并启动监听器
const background = new Background();