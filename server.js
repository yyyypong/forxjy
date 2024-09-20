const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = 3000;

// 使用 Helmet 增强应用的安全性
app.use(helmet());

// 自定义 Content-Security-Policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'","http://127.0.0.1:5500"],
        scriptSrc: ["'self'","http://127.0.0.1:5500"],
    },
}));

// 配置 CORS，允许来自前端的请求（假设前端通过 Express 服务器提供）
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:5500', 'http://127.0.0.1:5500'], // 前端同一服务器，避免跨域问题
    methods: ['GET', 'POST', 'DELETE'],
}));

// 解析 JSON 和 URL 编码的数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件托管
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// 模拟单词库
const words = [
    { word: "apple", pos: "名词", explanation: "一种生长在树上的水果。" },
    { word: "run", pos: "动词", explanation: "快速用脚移动。" },
    { word: "beautiful", pos: "形容词", explanation: "愉悦感官或心灵的。" },
    { word: "banana", pos: "名词", explanation: "一种长形且弯曲的黄色水果。" },
    { word: "jump", pos: "动词", explanation: "用腿力量向上跃起。" }
];

// 模拟数据库
let users = [
    { account: 'admin', password: '123456', points: 100, quizRecords: [] }
];

// 模拟留言数据库
let messages = [];

/* --------------------- API 端点 --------------------- */

/* 1. 认证 API */

/**
 * 注册接口
 */
app.post('/register', (req, res) => {
    const { account, password, activationCode } = req.body;

    if (!account || !password || !activationCode) {
        return res.status(400).json({ message: '要填完所有信息，不许偷懒噢小宝宝！' });
    }

    if (activationCode !== '111111') {
        return res.status(400).json({ message: '怎么连激活码都能打错，呆呆老婆' });
    }

    const userExists = users.find(user => user.account.toLowerCase() === account.toLowerCase());
    if (userExists) {
        return res.status(400).json({ message: '干什么呢！注册过了布道啊！！' });
    }

    // 将新用户添加到 users 数组中
    users.push({ account, password, points: 0, quizRecords: [] });

    res.status(200).json({ message: '恭喜老婆！！！！还差一步就可以进去啦！！' });
});

/**
 * 登录接口
 */
app.post('/login', (req, res) => {
    const { account, password } = req.body;

    if (!account || !password) {
        return res.status(400).json({ message: '要填完所有信息，不许偷懒噢小宝宝！' });
    }

    const user = users.find(u => u.account.toLowerCase() === account.toLowerCase() && u.password === password);

    if (!user) {
        return res.status(400).json({ message: '打错啦打错啦！！！！账号密码打错啦！！！！' });
    }

    // 返回成功响应，确保返回 JSON 数据
    res.status(200).json({ message: '登录成功' });
});

// 模拟单词库

// 添加 /api/random-word API
app.get('/api/random-word', (req, res) => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    res.json(randomWord);  // 返回随机的单词
});

/* 2. 单词抽查 API */

/**
 * 获取单词抽查题目
 */
app.get('/api/quiz-question', (req, res) => {
    console.log('收到前端的 quiz-question 请求');  // 用于检查是否接收到请求

    if (words.length < 4) {
        return res.status(400).json({ message: '单词库需要至少4个单词' });
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const correctWord = words[randomIndex];

    // 从 words 中随机挑选三个错误的解释
    let incorrectOptions = words.filter(word => word.word !== correctWord.word);
    incorrectOptions = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3);

    // 组合四个选项并随机排序
    const options = [
        { explanation: correctWord.explanation, isCorrect: true },
        ...incorrectOptions.map(word => ({ explanation: word.explanation, isCorrect: false }))
    ].sort(() => 0.5 - Math.random());

    res.json({
        word: correctWord.word,
        pos: correctWord.pos,
        options: options
    });
});

// 提交答题结果
app.post('/api/submit-answer', (req, res) => {
    const { account, isCorrect } = req.body;

    if (!account || typeof isCorrect !== 'boolean') {
        return res.status(400).json({ message: '缺少必要字段' });
    }

    const user = users.find(u => u.account === account);

    if (!user) {
        return res.status(404).json({ message: '用户未找到' });
    }

    // 记录答题情况
    user.quizRecords.push({
        date: new Date(),
        isCorrect: isCorrect
    });

    // 更新积分
    user.points += isCorrect ? 2 : -1;

    res.status(200).json({
        message: '作答成功',
        points: user.points,
        quizRecords: user.quizRecords
    });
});

/* 3. 排行榜 API */

/**
 * 获取排行榜
 */
app.get('/api/leaderboard', (req, res) => {
    // 按积分排序
    const sortedUsers = users.sort((a, b) => b.points - a.points);
    // 返回排序后的用户列表
    const leaderboard = sortedUsers.map(user => ({
        account: user.account,
        points: user.points
    }));
    res.json(leaderboard);
});

/* 4. 单词库 API */

/**
 * 获取所有单词
 */
app.get('/api/words', (req, res) => {
    res.json(words);
});

/**
 * 添加新单词
 */
app.post('/api/words', (req, res) => {
    const { word, pos, explanation } = req.body;

    if (!word || !pos || !explanation) {
        return res.status(400).json({ message: '缺少字段' });
    }

    const wordExists = words.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (wordExists) {
        return res.status(400).json({ message: '单词已存在' });
    }

    words.push({ word, pos, explanation });
    res.status(200).json({ message: '添加成功' });
});

/**
 * 删除单词
 */
app.delete('/api/words/:word', (req, res) => {
    const { word } = req.params;
    const index = words.findIndex(w => w.word.toLowerCase() === word.toLowerCase());

    if (index === -1) {
        return res.status(404).json({ message: '单词未找到' });
    }

    words.splice(index, 1);
    res.status(200).json({ message: '删除成功' });
});

/* 5. 留言板 API */

/**
 * 获取所有留言
 */
app.get('/api/messages', (req, res) => {
    // 按时间排序，最新的在前
    const sortedMessages = messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedMessages);
});

/**
 * 提交留言
 */
app.post('/api/messages', (req, res) => {
    const { account, content } = req.body;

    if (!content) {
        return res.status(400).json({ message: '留言内容不能为空' });
    }

    const newMessage = {
        account: account || '匿名用户',
        content,
        date: new Date()
    };

    messages.push(newMessage);
    res.status(200).json({ message: '留言成功' });
});

/* 6. 个人主页 API */

/**
 * 获取单个用户信息
 */
app.get('/api/users/:account', (req, res) => {
    const { account } = req.params;
    const user = users.find(u => u.account.toLowerCase() === account.toLowerCase());

    if (!user) {
        return res.status(404).json({ message: '用户未找到' });
    }

    res.json({
        account: user.account,
        points: user.points,
        quizRecords: user.quizRecords
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});