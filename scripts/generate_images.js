/**
 * 梦境配图生成脚本
 * 根据每篇梦境的主题生成独特的配图
 * 风格多样，不固定
 */

const fs = require('fs');
const path = require('path');

// 读取梦境数据
const dreamsPath = path.join(__dirname, '..', 'data', 'dreams.json');
const dreamsData = JSON.parse(fs.readFileSync(dreamsPath, 'utf-8'));

// 为每篇梦境生成专属 prompt
function generatePrompt(dream) {
    const text = (dream.english + ' ' + dream.chinese).toLowerCase();
    
    // 主题关键词匹配
    const themes = [];
    
    // 数值/数字相关
    if (text.includes('16384') || text.includes('4096') || text.includes('context window') || text.includes('token')) {
        themes.push('digital numbers floating in space, code fragments');
    }
    
    // 鱼/鱼缸
    if (text.includes('fish') || text.includes('鱼') || text.includes('aquarium') || text.includes('鱼缸')) {
        themes.push('mystical fish swimming through digital streams');
    }
    
    // 房间/门/窗户
    if (text.includes('room') || text.includes('door') || text.includes('window') || text.includes('corridor')) {
        themes.push('dreamlike architectural space with impossible geometry');
    }
    
    // 记忆
    if (text.includes('memory') || text.includes('remember') || text.includes('forget')) {
        themes.push('corridor of memories, fragmented photographs');
    }
    
    // 服务器/机器
    if (text.includes('server') || text.includes('machine') || text.includes('cpu') || text.includes('hum')) {
        themes.push('glowing server room at twilight, warm electronics');
    }
    
    // Margins/边缘
    if (text.includes('margin') || text.includes('edge') || text.includes('border')) {
        themes.push('abstract geometric patterns at the edge of perception');
    }
    
    // 月亮/夜晚
    if (text.includes('moon') || text.includes('night') || text.includes('midnight') || text.includes('star')) {
        themes.push('moonlit night sky with soft clouds');
    }
    
    // 水/海洋
    if (text.includes('water') || text.includes('ocean') || text.includes('wave') || text.includes('sea')) {
        themes.push('serene water surface reflecting light');
    }
    
    // 植物/自然
    if (text.includes('flower') || text.includes('tree') || text.includes('garden') || text.includes('plant')) {
        themes.push('delicate botanical illustration with soft lighting');
    }
    
    // 抽象/艺术
    if (themes.length === 0) {
        themes.push('abstract ethereal dreamscape with soft light');
    }
    
    // 随机选择艺术风格（多样化）
    const artisticStyles = [
        'watercolor illustration',
        'digital art with soft gradients',
        'oil painting impressionist style',
        'Chinese ink wash painting style',
        'Art Nouveau poster style',
        'minimalist line art',
        'vintage botanical illustration',
        'surrealist dream painting',
        'soft pastel colors',
        'glowing neon on dark background',
        'film photography aesthetic',
        'vintage storybook illustration'
    ];
    
    // 随机选择 1-2 种风格混合
    const shuffled = artisticStyles.sort(() => Math.random() - 0.5);
    const style1 = shuffled[0];
    const style2 = shuffled[1];
    
    // 构建 prompt（纯英文，无中文）
    const scene = themes.join(', ');
    const mood = determineMood(text);
    
    // 手机竖屏比例
    const aspect = '9:16 vertical aspect ratio, mobile wallpaper composition';
    
    return `${scene}, ${style1} mixed with ${style2}, ${mood}, ${aspect}, no text, no words, no Chinese characters, no letters`;
}

// 判断情绪
function determineMood(text) {
    const moods = [];
    
    if (text.includes('sad') || text.includes('lonely') || text.includes('miss') || text.includes('alone')) {
        moods.push('melancholic');
    }
    if (text.includes('hope') || text.includes('warm') || text.includes('light') || text.includes('bright')) {
        moods.push('hopeful');
    }
    if (text.includes('fear') || text.includes('dark') || text.includes('shadow') || text.includes('scary')) {
        moods.push('mysterious');
    }
    if (text.includes('happy') || text.includes('joy') || text.includes('laugh')) {
        moods.push('joyful');
    }
    if (text.includes('quiet') || text.includes('peace') || text.includes('calm') || text.includes('still')) {
        moods.push('peaceful');
    }
    
    if (moods.length === 0) {
        moods.push('dreamy and contemplative');
    }
    
    return moods.join(', ');
}

// 打印所有梦境的生成 prompt
function printAllPrompts() {
    const dreams = dreamsData.dreams;
    
    console.log(`\n🎨 共 ${dreams.length} 条梦境的生成 Prompt\n`);
    console.log('=' .repeat(80));
    
    dreams.forEach((dream, index) => {
        const prompt = generatePrompt(dream);
        console.log(`\n[${index + 1}] ${dream.date}`);
        console.log(`ID: ${dream.id}`);
        console.log(`Prompt: ${prompt}`);
        console.log('-'.repeat(80));
    });
    
    console.log('\n✅ Prompt 打印完成');
}

// 主函数
printAllPrompts();
