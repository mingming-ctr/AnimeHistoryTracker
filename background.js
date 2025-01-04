import { openDatabase } from './Database.js';
import { recordWatchHistory } from './History.js';

// 添加调试信息
console.log('Background script is ready and listening for messages');

// 添加消息监听器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message in background:', request);
    
    switch (request.action) {
        case 'openDatabase':
            openDatabase().then(() => {
                sendResponse({status: 'success', message: 'Database opened!'});
            }).catch((error) => {
                sendResponse({status: 'error', message: error.message});
            });
            return true; // 保持通道打开

        case 'recordWatchHistory':
            console.log('记录观看历史:', request);
            recordWatchHistory(request.title, request.url, request.episode).then(() => {
                sendResponse({status: 'success', message: 'Watch history recorded!'});
            }).catch((error) => {
                sendResponse({status: 'error', message: error.message});
            });
            return true; // 保持通道打开

        default:
            sendResponse({status: 'unknown action', message: 'No action found.'});
            break;
    }
});