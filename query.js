import { db } from './Database.js'; // 导入 Database 单例

class Query {
    constructor() {
        this.objectStoreName = db.constructor.STORE_NAME; // 从 db 中读取对象存储名
        this.initDatabase();
        this.bindEvents(); // 绑定事件
    }

    // 绑定搜索按钮和输入框的事件
    bindEvents() {
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', () => this.handleSearch());

        const searchInput = document.getElementById('search');
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') { // 检查是否按下回车键
                this.handleSearch(); // 调用搜索处理方法
                event.preventDefault(); // 防止表单提交
            }
        });
    }

// 处理搜索
async handleSearch() {
    const searchTerm = document.getElementById('search').value.toLowerCase().trim(); // 获取搜索输入
    const allRecords = await db.getAllRecords(); // 获取所有记录

    // 过滤记录
    const filteredRecords = allRecords.filter(record => 
        record.title.toLowerCase().includes(searchTerm)
    );

    if (filteredRecords.length === 0) {
        // 如果没有找到记录，重定向到指定的 URL
        window.location.href = `https://www.295k.cc/search/-------------.html?wd=${encodeURIComponent(searchTerm)}`;
    } else {
        this.displayRecords(filteredRecords); // 显示过滤后的记录
    }
}

    // 初始化数据库
    async initDatabase() {
        try {
            // await db.init(); // 初始化数据库
            const records = await this.queryRecords(); // 调用 queryRecords 方法获取记录
            this.displayRecords(records); // 显示记录
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    }

    // 加载观看历史
    async loadWatchHistory() {
        await this.queryRecords(); // 调用 queryRecords，不传递参数
    }


    async queryDeleteRecord(id) {
        try {
            await db.deleteAnime(id); // 使用 db 删除指定 ID 的记录
            this.loadWatchHistory(); // 删除成功后重新显示记录
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    }
    // 查询记录的方法
    async queryRecords() {
        try {
            const records = await db.getAllRecords(); // 从数据库获取所有记录
            return records; // 返回获取的记录
        } catch (error) {
            console.error('Error querying records:', error);
            return []; // 如果出错，返回空数组
        }
    }
    async loadWatchHistory() {
        try {
            const records = await db.getAllRecords(); // 使用 db 获取所有记录
            console.log('读取到的记录:', records); // 输出读取到的记录
            this.displayRecords(records); // 显示读取到的记录
        } catch (error) {
            console.error('获取记录失败:', error); // 输出获取记录失败的错误
        }
    }

    // 显示记录的函数
    displayRecords(records) {
        const recordList = document.getElementById('recordList'); // 获取记录列表的容器
        recordList.innerHTML = ''; // 清空现有记录

        records.forEach(record => {
            const listItem = document.createElement('li');
            listItem.className = 'record-item'; // 添加类名以应用样式
            const formattedTimestamp = new Date(record.timestamp).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); // 格式化时间
            const formattedEpisode = record.episode.toString().padStart(3, '0'); // 确保集数显示为三位数
            listItem.innerHTML = `
            <span class='record-title'>${record.title}</span>
            <span class='record-episode'>集数: <a href='${record.url}' target='_blank'>第${formattedEpisode}集</a></span>
            <span class='record-timestamp'>${formattedTimestamp}</span>
            <button class='delete-button'>删除</button>
        `;

            const deleteButton = listItem.querySelector('.delete-button');
            deleteButton.onclick = () => this.queryDeleteRecord(record.id); // 绑定删除事件
            recordList.appendChild(listItem); // 将列表项添加到记录列表中
        });
    }

}

const query = new Query();

document.addEventListener('DOMContentLoaded', function () {
    // 绑定搜索事件
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', () => query.queryRecords());
    } else {
        console.error('Search input with id "search" not found.');
    }
});

document.getElementById('clearAll').onclick = async function () {
    console.log('清空所有记录按钮被点击'); // 调试信息
    try {
        // await db.init(); // 初始化数据库
        await db.clearAllRecords(); // 调用清空记录的方法
        console.log('所有记录已清空');
        query.displayRecords([]); // 重新显示记录（清空状态）
    } catch (error) {
        console.error(error); // 输出错误信息
    }
};
