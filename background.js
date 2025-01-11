import { openDatabase } from './Database.js';
import { recordWatchHistory } from './History.js';

class Background {
    constructor() {
        console.log('Background script is ready and listening for messages');
        this.init();
    }

    init() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log('Received message in background:', request);
            this.handleMessage(request, sendResponse);
            return true; // 保持通道打开
        });
    }

    async handleMessage(request, sendResponse) {
        switch (request.action) {
            case 'openDatabase':
                try {
                    await openDatabase();
                    sendResponse({status: 'success', message: 'Database opened!'});
                } catch (error) {
                    sendResponse({status: 'error', message: error.message});
                }
                break;

            case 'recordWatchHistory':
                console.log('记录观看历史:', request);
                try {
                    await recordWatchHistory(request.title, request.url, request.episode);
                    sendResponse({status: 'success', message: 'Watch history recorded!'});
                } catch (error) {
                    sendResponse({status: 'error', message: error.message});
                }
                break;

            default:
                sendResponse({status: 'unknown action', message: 'No action found.'});
                break;
        }
    }
}

const background = new Background();