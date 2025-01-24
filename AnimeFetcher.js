import { load } from 'cheerio';
import { db } from './Database.js';


class AnimeFetcher {
    constructor(url) {
        this.url = url; // 保存传入的 URL  
        this.database = db; // 创建 Database 实例

    }

    async fetchLatestEpisode() {
        try {
            const response = await fetch(this.url);
            const html = await response.text(); // 获取网页的 HTML 内容

            // 使用 cheerio 的 load 方法
            const $ = load(html); // 使用 load 方法加载 HTML

            const animeTitle = $('h1').text(); // 提取动漫名称
            const latestEpisodeUrl = this.extractLatestEpisodeUrl($); // 提取最新集链接
            const episodeNumber = this.extractEpisodeNumber(latestEpisodeUrl); // 提取集数

            // 返回对象，保持 title 不变，使用新的属性名称
            return {
                title: animeTitle, // 保持原有的 title 字段
                latestEpisodeNumber: episodeNumber, // 新的属性名称
                latestEpisodeUrl: latestEpisodeUrl, // 新的属性名称
            };
        } catch (error) {
            console.error('Error fetching the latest episode:', error);
        }
    }

    extractLatestEpisodeUrl($) {
        // 查找所有包含集链接的 <a> 标签
        const episodeLinks = $('a.module-play-list-link'); // 替换为实际选择器
        const latestEpisodeLink = episodeLinks.last().attr('href'); // 获取最后一个链接

        // 检查链接是否为相对链接，如果是，则构建绝对链接
        if (latestEpisodeLink && !latestEpisodeLink.startsWith('http')) {
            return `https://www.295k.cc${latestEpisodeLink}`; // 返回绝对链接
        }

        return latestEpisodeLink || null; // 返回链接或 null
    }

    extractEpisodeNumber(latestEpisodeUrl) {
        if (latestEpisodeUrl) {
            // 假设最新链接格式为 /dongmanplay/8122-1-1.html
            const parts = latestEpisodeUrl.split('-'); // 分割链接
            const episodeWithHtml = parts[parts.length - 1]; // 获取最后一个部分
            const episodeNumber = episodeWithHtml.replace('.html', ''); // 去掉 .html 后缀
            return episodeNumber || '未知集数'; // 返回集数或默认值
        }
        return '未知集数'; // 如果没有链接，返回默认值
    }

    async fetchAllRecords() {
        try {
            const records = await this.database.getAllRecords(); // 调用 getAllRecords 方法
            console.log('所有记录:', records); // 打印所有记录
            return records; // 返回记录
        } catch (error) {
            console.error('获取记录时出错:', error);
        }
    }
    async fetchWatchAnimeRecords(title) {
        const allRecords = await this.fetchAllRecords(); // 获取所有记录
        if (allRecords) {
            // 过滤出观看动漫记录
            const watchAnimeRecords = allRecords.filter(record => record.title === title);
            console.log('观看动漫记录:', watchAnimeRecords);
            return watchAnimeRecords; // 返回观看记录
        }
        return []; // 如果没有记录，返回空数组
    }
    addPropertiesToRecords(watchAnimeRecords, latestEpisodeInfo) {
        // 遍历每条记录
        watchAnimeRecords.forEach(record => {
            // 将 latestEpisodeInfo 的所有属性添加到当前记录
            Object.keys(latestEpisodeInfo).forEach(key => {
                record[key] = latestEpisodeInfo[key];
            });
             // 更新数据库中的记录
        db.updateAnime(record); // 假设 db 是你的数据库实例

        });
        return watchAnimeRecords; // 返回更新后的记录
    }


}
// 导出 AnimeFetcher 类以供其他模块使用
export { AnimeFetcher };