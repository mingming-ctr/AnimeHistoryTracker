console.log('content.js 已加载');
// content.js
// import { openDatabase } from './Database.js';
// import { recordWatchHistory } from './History.js';


// 发送消息请求打开数据库
chrome.runtime.sendMessage({action: 'openDatabase'}, (response) => {
    console.log(response);
});

// 发送测试消息
(async () => {
    const response = await chrome.runtime.sendMessage({action: 'testMessage'});
    console.log('Test message response:', response);
})();

// 创建播放下集按钮
const button = document.createElement('button');
button.innerText = '播放下集';
button.style.marginLeft = '10px';
button.style.padding = '10px';
button.style.backgroundColor = '#ff0000';
button.style.color = '#ffffff';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';

// 添加按钮点击事件
button.onclick = function(event) {
    event.preventDefault(); // 阻止默认的提交行为
    // 获取当前 URL
    const currentUrl = window.location.href;
    console.log('当前URL:', currentUrl); // 调试日志
    // 使用正则表达式匹配并增加最后一个数字
    const nextUrl = currentUrl.replace(/(\d+)(?=\.html$)/, (match) => parseInt(match) + 1);
    console.log('下一个URL:', nextUrl); // 调试日志
    
    // 跳转到下一个视频
    try {
        window.location.href = nextUrl;
    } catch (error) {
        console.error('跳转到下一个视频失败:', error); // 调试日志
    }
};

// 找到搜索框并将按钮添加到搜索框旁边
const searchBar = document.querySelector('div.searchbar');
if (searchBar) {
    searchBar.style.display = 'flex'; // 确保搜索框是 flex 布局
    searchBar.appendChild(button); // 添加播放下集按钮
} else {
    console.log('搜索框未找到'); // 调试日志
}

console.log('DOM fully loaded and parsed');

const currentUrl = window.location.href;

// 验证 URL 是否符合要求
const pattern = /^(https?:\/\/[^\s/$.?#].[^\s]*\/dongmanplay\/\d+-\d+-\d+\.html)$/;
if (pattern.test(currentUrl)) {
    console.log('当前播放地址符合要求，准备保存。');
    // 发送消息请求保存观看历史
    const episodeNumber = currentUrl.match(/-(\d+)-(\d+)\.html$/);
    const episodeText = episodeNumber ? `第${episodeNumber[2].padStart(3, '0')}集` : '';
    const animeTitle = document.querySelector('.module-info-heading h1 a');
    const titleText = animeTitle ? animeTitle.innerText : '';

    // 发送消息请求保存观看历史
    console.log('准备保存的观看历史记录:', { title: titleText, url: currentUrl, episode: episodeText });
    chrome.runtime.sendMessage({action: 'recordWatchHistory', title: titleText, url: currentUrl, episode: episodeText}, (response) => {
        console.log('保存状态:', response.status);
    });
} else {
    console.log('当前播放地址不符合要求，不用记录。');
}
