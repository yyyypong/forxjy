document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.container');
    const navLinks = document.querySelectorAll('nav a');

    // 隐藏所有内容区域
    function hideAllSections() {
        sections.forEach(section => section.style.display = 'none');  // 使用 display:none 来隐藏
    }

    // 显示指定的内容区域
    function showSection(sectionId) {
        hideAllSections();  // 隐藏所有区域
        document.getElementById(sectionId).style.display = 'block';  // 显示指定区域
    }

    // 恢复“单词抽查”页面的初始状态
    function resetQuizSection() {
        // 清空选项和结果
        document.getElementById('quizWordDisplay').innerHTML = '';
        document.getElementById('quizOptions').innerHTML = '';
        document.getElementById('quizResult').innerHTML = '';

        // 重置按钮状态
        document.getElementById('submitAnswerBtn').disabled = true;
    }

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();  // 阻止默认的跳转行为
            const sectionId = event.target.getAttribute('data-section');  // 获取 data-section 属性
            showSection(sectionId);  // 显示对应的内容区域

            // 清空单词抽查页面的数据（如果切换出去）
            if (sectionId !== 'quizSection') {
                resetQuizSection();
            }
        });
    });

    // 默认显示 homeSection
    showSection('homeSection');

    // 从服务器获取随机单词并更新页面
    function refreshWord() {
        fetch('http://localhost:3000/api/random-word')  // 从后端获取随机单词
            .then(response => response.json())
            .then(data => {
                // 更新页面上的单词内容
                const wordDisplay = document.getElementById("wordDisplay");
                wordDisplay.innerHTML = `
                    <h1>${data.word}</h1>
                    <p>词性: ${data.pos}</p>
                    <p>解释: ${data.explanation}</p>
                `;
                // 添加动画效果
                wordDisplay.classList.add("fadeIn");
                setTimeout(() => wordDisplay.classList.remove("fadeIn"), 1000);
            })
            .catch(error => console.error('Error:', error));
    }

    // 页面加载时自动刷新一次单词
    refreshWord();

    // 每5秒自动刷新一次单词
    setInterval(refreshWord, 5000);

    // 点击按钮时手动刷新单词
    document.getElementById("refreshBtn").addEventListener("click", refreshWord);


    // 从服务器获取随机单词和选项
    function loadQuizQuestion() {
        fetch('http://localhost:3000/api/quiz-question')  // 确保端口号正确
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载单词，检查服务端');
                }
                return response.json();
            })
            .then(data => {
                // 处理获取到的单词和选项
                document.getElementById("quizWordDisplay").innerHTML = `
                    <h3>${data.word}</h3>
                    <p>词性: ${data.pos}</p>
                `;
                const optionsContainer = document.getElementById("quizOptions");
                optionsContainer.innerHTML = '';  // 清空之前的选项
                data.options.forEach((option, index) => {
                    const optionElement = document.createElement("div");
                    optionElement.innerHTML = `
                        <input type="radio" name="quizOption" id="option${index}" value="${option.isCorrect}" />
                        <label for="option${index}">${option.explanation}</label>
                    `;
                    optionsContainer.appendChild(optionElement);
                });
    
                // 启用提交按钮
                document.getElementById('submitAnswerBtn').disabled = false;
            })
            .catch(error => console.error('Error:', error));
    }

    // 用户提交答案
    document.getElementById('submitAnswerBtn').addEventListener('click', function () {
        const selectedOption = document.querySelector('input[name="quizOption"]:checked');

        if (!selectedOption) {
            alert('请选择一个选项');
            return;
        }

        // 提交答案到服务器
        const isCorrect = selectedOption.value === "true";
        const account = 'example';  // 这里应该使用当前登录的用户账号

        fetch('http://localhost:3000/api/submit-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account, isCorrect })
        })
        .then(response => response.json())
        .then(data => {
            // 显示结果
            document.getElementById('quizResult').innerHTML = isCorrect ? '答对了！' : '答错了！';

            // 更新积分和答题记录
            // 你可以在这里更新进度条和答题统计信息
        })
        .catch(error => console.error('Error:', error));
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const quizSection = document.getElementById('quizSection');
    const submitAnswerBtn = document.getElementById('submitAnswerBtn');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const totalAttemptsDisplay = document.getElementById('totalAttempts');
    const accuracyDisplay = document.getElementById('accuracy');
    const weeklyProgressDisplay = document.getElementById('weeklyProgress');
    const progressFill = document.getElementById('progressFill');
    const warningMessage = document.getElementById('warningMessage');

    let totalAttempts = 0;
    let correctAnswers = 0;
    let weeklyAttempts = 0;
    const weeklyQuota = 20; // 每周的抽查任务数
    const userAccount = 'testUser'; // 用户账号，实际使用时可以动态获取

    // 页面加载时显示 quizSection
    quizSection.style.display = 'block';

    // 获取题目和选项
    async function loadQuizQuestion() {
        try {
            const response = await fetch('http://localhost:3000/api/quiz-question'); // 确保端口正确
            if (!response.ok) {
                throw new Error('无法加载单词，检查服务端');
            }
            const quizData = await response.json();

            // 显示单词
            document.getElementById('quizWordDisplay').innerHTML = `<h3>${quizData.word}</h3>`;

            // 生成选项
            const optionsContainer = document.getElementById('quizOptions');
            optionsContainer.innerHTML = ''; // 清空之前的选项
            quizData.options.forEach((option, index) => {
                const optionElement = document.createElement("div");
                optionElement.innerHTML = `
                    <input type="radio" name="quizOption" id="option${index}" value="${option.isCorrect}" />
                    <label for="option${index}">${option.explanation}</label>
                `;
                optionsContainer.appendChild(optionElement);
            });

            // 启用提交按钮，禁用下一题按钮
            submitAnswerBtn.disabled = false;
            nextQuestionBtn.disabled = true;
        } catch (error) {
            console.error('Error:', error);
            alert('加载题目时发生错误，请稍后再试。');
        }
    }

    // 提交答案
    async function submitAnswer(isCorrect) {
        try {
            const response = await fetch('http://localhost:3000/api/submit-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: userAccount, isCorrect })
            });
            if (!response.ok) {
                throw new Error('提交答案失败');
            }

            const result = await response.json();

            // 更新统计信息
            totalAttempts++;
            if (isCorrect) {
                correctAnswers++;
                alert('答对了！');
            } else {
                alert('答错了！');
            }

            // 禁用提交按钮和选项，启用下一题按钮
            submitAnswerBtn.disabled = true;
            document.querySelectorAll('input[name="quizOption"]').forEach(input => input.disabled = true);
            nextQuestionBtn.disabled = false;

            updateStats();
        } catch (error) {
            console.error('Error:', error);
            alert('提交答案时发生错误，请稍后再试。');
        }
    }

    // 更新统计信息
    function updateStats() {
        const accuracy = Math.round((correctAnswers / totalAttempts) * 100);

        // 更新显示
        totalAttemptsDisplay.textContent = totalAttempts;
        accuracyDisplay.textContent = `${accuracy}%`;
        progressFill.style.width = `${accuracy}%`;

        // 更新本周任务进度
        weeklyAttempts++;
        weeklyProgressDisplay.textContent = `${weeklyAttempts}/${weeklyQuota}`;

        // 如果接近截止日期且未完成任务，显示警告
        const daysLeft = getDaysLeftInWeek();
        if (daysLeft <= 1 && weeklyAttempts < weeklyQuota) {
            warningMessage.style.display = 'block';
        } else {
            warningMessage.style.display = 'none';
        }
    }

    // 获取本周剩余天数
    function getDaysLeftInWeek() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysLeft = 7 - dayOfWeek;
        return daysLeft;
    }

    // 监听提交按钮点击事件
    submitAnswerBtn.onclick = function () {
        const selectedOption = document.querySelector('input[name="quizOption"]:checked');
        if (!selectedOption) {
            alert('请选择一个选项');
            return;
        }
        const isCorrect = selectedOption.value === 'true'; // 转换为布尔值
        submitAnswer(isCorrect);
    };

    // 监听“下一题”按钮点击事件，加载下一题
    nextQuestionBtn.onclick = function () {
        loadQuizQuestion();
    };

    // 每次进入主页都重新加载题目
    function showQuizSection() {
        quizSection.style.display = 'block';
        loadQuizQuestion(); // 每次显示主页时重新加载题目
    }

    // 页面加载时默认加载第一个单词
    showQuizSection(); // 调用显示和加载
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        const targetSection = this.getAttribute('data-target');
        
        // 隐藏所有 sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // 显示目标 section
        document.getElementById(targetSection).style.display = 'block';

        // 如果是回到主页，则调用显示单词抽查
        if (targetSection === 'quizSection') {
            showQuizSection(); // 确保每次回到主页都重新加载单词
        }
    });
});