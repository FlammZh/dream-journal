/**
 * 梦境数据提取脚本
 * 从 DREAMS.md 提取梦境内容，生成结构化 JSON
 */

const fs = require('fs');
const path = require('path');

// 读取 DREAMS.md
const dreamsPath = path.join(__dirname, '..', '..', 'DREAMS.md');
let content = fs.readFileSync(dreamsPath, 'utf-8');

// 清理 HTML 注释标记
content = content.replace(/<!--[\s\S]*?-->/g, '');

// 按 --- 分隔每个梦境
const blocks = content.split(/\n---\n/).filter(b => b.trim());

const dreams = [];

blocks.forEach((block, index) => {
    block = block.trim();
    if (!block) return;
    
    // 跳过包含系统标记的内容
    if (block.includes('openclaw:dreaming')) return;
    
    // 提取日期时间行
    const dateMatch = block.match(/\*([A-Za-z]+ \d{1,2}, \d{4} at \d{1,2}:\d{2} (?:AM|PM))\*/);
    if (!dateMatch) return;
    
    const dateStr = dateMatch[1];
    
    // 提取 emoji（如果有）
    const emojiMatch = block.match(/🦐/);
    const emoji = emojiMatch ? '🦐' : '';
    
    // 移除日期行，获取正文
    let body = block.replace(dateMatch[0], '').trim();
    
    // 分割中英文内容
    // 策略：按段落分，如果一段包含中文则归为中文，否则为英文
    const paragraphs = body.split(/\n\n+/).filter(p => p.trim());
    
    let english = '';
    let chinese = '';
    
    paragraphs.forEach(para => {
        para = para.trim();
        if (!para) return;
        
        // 跳过 emoji 单独一行
        if (para === '🦐') return;
        
        // 检测是否包含中文字符
        if (/[\u4e00-\u9fa5]/.test(para)) {
            chinese += para + '\n\n';
        } else {
            // 移除 Markdown 格式
            para = para.replace(/\*([^*]+)\*/g, '$1');  // 移除斜体星号
            english += para + '\n\n';
        }
    });
    
    // 清理内容
    english = english.replace(/\n{3,}/g, '\n\n').trim();
    chinese = chinese.replace(/\n{3,}/g, '\n\n').trim();
    
    // 跳过没有内容的
    if (!english && !chinese) return;
    
    // 生成唯一 ID
    const dateSlug = dateStr.replace(/[ ,:]/g, '-').toLowerCase();
    
    dreams.push({
        id: `dream_${dateSlug}`,
        date: dateStr,
        rawDate: dateStr,
        english: english,
        chinese: chinese,
        image: null,
        music: null,
        created: new Date().toISOString()
    });
});

// 去重（基于日期时间）
const seen = new Set();
const uniqueDreams = dreams.filter(d => {
    if (seen.has(d.rawDate)) return false;
    seen.add(d.rawDate);
    return true;
});

// 输出到 JSON
const output = {
    config: require('../data/config.json'),
    dreams: uniqueDreams
};

fs.writeFileSync(
    path.join(__dirname, 'dreams.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
);

console.log(`✅ 提取完成！共 ${uniqueDreams.length} 条梦境`);
console.log(`📁 输出到: ${path.join(__dirname, 'dreams.json')}`);
