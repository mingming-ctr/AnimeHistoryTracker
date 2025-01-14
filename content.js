class VideoPlayer {
    constructor() {
        this.playLatestButton = null;
        this.nextButton = null;
        this.keydownListener = null;
    }

    static getInstance() {
        if (!playerInstance) {
            playerInstance = new VideoPlayer();
        }
        return playerInstance;
    }

    init() {
        this.createButtons();
        this.addEventListeners();
        this.checkUrlAndSaveHistory();
    }

    createButtons() {
        this.nextButton = this.createButton('播放下集', this.handleNext);
        this.playLatestButton = this.createButton('播放最新', this.handlePlayLatest);
        if (this.nextButton) {
            this.nextButton.parentElement.insertBefore(this.playLatestButton, this.nextButton.nextSibling);
        }
    }

    createButton(text, handler) {
        const button = document.createElement('button');
        button.innerText = text;
        button.className = 'mac_user header-op-user';
        button.style.margin = '10px';
        button.onclick = handler.bind(this);
        const searchBar = document.querySelector('div.searchbar');
        if (searchBar) {
            searchBar.style.display = 'flex';
            searchBar.appendChild(button);
        } else {
            console.log('搜索框未找到');
        }
        return button;
    }

    handleNext(event) {
        event.preventDefault();
        const currentUrl = window.location.href;
        const nextUrl = currentUrl.replace(/(\d+)(?=\.html$)/, (match) => parseInt(match) + 1);
        window.location.href = nextUrl;
    }

    handlePlayLatest(event) {
        event.preventDefault();
        const lastEpisodeLink = document.querySelector('.module-play-list-content .module-play-list-link:last-child');
        if (lastEpisodeLink) {
            window.location.href = lastEpisodeLink.href;
        }
    }

    addEventListeners() {
        this.keydownListener = (event) => {
            if (event.code === 'NumpadEnter') {
                this.nextButton.click();
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', this.keydownListener);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keydownListener);
    }

checkUrlAndSaveHistory() {
    const currentUrl = window.location.href;
    const pattern = /^(https?:\/\/[^\s/$.?#].[^\s]*\/dongmanplay\/\d+-\d+-\d+\.html)$/;
    if (pattern.test(currentUrl)) {
        const episodeNumber = currentUrl.match(/-(\d+)-(\d+)\.html$/);
        const episodeText = episodeNumber ? `${episodeNumber[2].padStart(3, '0')}` : '001';
        const animeTitle = document.querySelector('.module-info-heading h1 a');
        const titleText = animeTitle ? animeTitle.innerText : '';
        chrome.runtime.sendMessage({action: 'recordWatchHistory', title: titleText, url: currentUrl, episode: episodeText}, (response) => {
            console.log('保存状态:', response);
        });
    } else {
        console.log('当前播放地址不符合要求，不用记录。');
    }
}
}

let playerInstance = null; // 用于存储 VideoPlayer 的单例实例

(async () => {
    console.log('content.js 已加载');

    (function() {
        const player = VideoPlayer.getInstance();
        player.init();
    })();


    // 移除事件监听器
    window.addEventListener('beforeunload', () => {
        const player = VideoPlayer.getInstance();
        player.removeEventListeners();
    });

    console.log('DOM fully loaded and parsed');
})();

window.playerInstance = playerInstance; // 将 playerInstance 赋值给全局对象，以便在控制台中访问
