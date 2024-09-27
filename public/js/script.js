    function toggleForm() {
            const loginForm = document.getElementById("loginForm");
            const registerForm = document.getElementById("registerForm");
            if (loginForm.style.display === "none") {
                loginForm.style.display = "block";
                registerForm.style.display = "none";
            } else {
                loginForm.style.display = "none";
                registerForm.style.display = "block";
            }
        }

    function login() {
    // 获取用户输入的账号和密码
        const account = document.getElementById('loginAccount').value;
        const password = document.getElementById('loginPassword').value;

    // 检查是否输入了账号和密码
        if (!account || !password) {
            alert('请输入账号和密码');
            return;            
        }

    // 发起POST请求，向服务器发送登录请求
    fetch('http://localhost:3000/login', {  // 确保路径和端口正确
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // 告诉服务器发送的是JSON数据
        },
        body: JSON.stringify({ account, password })  // 将账号和密码发送给服务器
    })
    .then(response => response.json())  // 解析服务器的JSON响应
    .then(data => {
        if (data.message === '登录成功') {
            alert('登进来咯！！！！我老婆登进来咯！！！！！');
            // 登录成功后可以重定向到主页或其他页面
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('account', account);
            window.location.href = 'home.html';  // 假设登录后跳转到home.html
            loadUserProfile();
        } else {
            alert(data.message);  // 显示服务器返回的错误信息
        }
    })
    .catch(error => {
        console.error('Error:', error);  // 处理请求错误
        alert('你什么也没看到，我代码出问题了TAT');
    });

    console.log('登录按钮被点击');
}
 
function register() {
    // 获取用户输入的账号和密码
    const account = document.getElementById('registerAccount').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const activationCode = document.getElementById('activationCode').value.trim();

    // 检查是否输入了账号和密码
            if (!account || !password || !activationCode) {
                alert('要填完所有信息，不许偷懒噢小宝宝');
                return;
            }

    // 发起POST请求，向服务器发送登录请求
    fetch('http://localhost:3000/register', {  // 确保路径和端口正确
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // 告诉服务器发送的是JSON数据
        },
        body: JSON.stringify({ account, password, activationCode })  // 将账号和密码发送给服务器
    })
    .then(response => response.json())  // 解析服务器的JSON响应
    .then(data => {
        if (data.message === '恭喜老婆！！！！还差一步就可以进去啦！！') {
            alert('恭喜老婆！！！！还差一步就可以进去啦！！');
            toggleForm();
        } else {
            alert(data.message);  // 显示服务器返回的错误信息
        }
    })
    .catch(error => {
        console.error('Error:', error);  // 处理请求错误
        alert('你什么也没看到，我代码出问题了TAT');
    });

    console.log('注册按钮被点击');
}


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

    // 恢复"单词抽查"页面的初始状态
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
                loadQuizQuestion();
            }
            if (sectionId === 'leaderboardSection') {
                loadLeaderboard();
            }
        });
    });

    // 默认显示 homeSection
    hideAllSections();
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
    setInterval(refreshWord, 4000);

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
        const account = localStorage.getItem('account');  // 获取当前登录的用户账号

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
    const userAccount = localStorage.getItem('account'); // 获取当前登录的用户账号

    // 页面加载时显示 quizSection
    //quizSection.style.display = 'block';

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
            alert('加载题目时发生错误，请稍后再。');
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

    // 监听"下一题"按钮点击事件，加载下一题
    nextQuestionBtn.onclick = function () {
        loadQuizQuestion();
    };

    // 每次进入主页都重新加载题目
    function showQuizSection() {
        quizSection.style.display = 'block';
        loadQuizQuestion(); // 每次显示主页时重新加载题目
    }
    // 加载排行榜数据并显示在表格中
    function loadLeaderboard() {
        fetch('http://localhost:3000/api/leaderboard')
            .then(response => response.json())
            .then(data => {
                const leaderboardBody = document.getElementById('leaderboardBody');
                leaderboardBody.innerHTML = '';  // 清空之前的内容

                data.forEach((user, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${user.account}</td>
                        <td>${user.points}</td>
                    `;
                    leaderboardBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error loading leaderboard:', error));
    }
    document.addEventListener('DOMContentLoaded', loadLeaderboard);

    // 页面加载时默认加载第一个单词
    //showQuizSection(); // 调用显示和加载
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
        if (targetSection === 'leaderboardSection') {
            loadLeaderboard();
        }
        if (targetSection === 'wordbankSection') {
            loadWordbank();
        }
        if (targetSection === 'messageSection') {
            loadMessage();
        }
        if (targetSection === 'profileSection') {
            loadUserProfile();
        }
    });
});

function loadLeaderboard() {
    fetch('http://localhost:3000/api/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboardBody = document.getElementById('leaderboardBody');
            leaderboardBody.innerHTML = '';  // 清空之前的内容

            data.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.account}</td>
                    <td>${user.points}</td>
                `;
                leaderboardBody.appendChild(row);
            });
        })
        .catch(error => console.error('加载排行榜时出错:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const wordList = document.getElementById('wordList');
    const searchInput = document.getElementById('searchInput');
    const newWord = document.getElementById('newWord');
    const newPos = document.getElementById('newPos');
    const newExplanation = document.getElementById('newExplanation');
    const addWordBtn = document.getElementById('addWordBtn');

    // 加载单词库
    function loadWordbank() {
        fetch('http://localhost:3000/api/words')
            .then(response => response.json())
            .then(data => {
                wordList.innerHTML = '';
                data.forEach(word => {
                    const wordItem = document.createElement('div');
                    wordItem.className = 'word-list-item';
                    wordItem.innerHTML = `
                        <span>${word.word} (${word.pos}): ${word.explanation}</span>
                        <button onclick="deleteWord('${word.word}')">删除</button>
                    `;
                    wordList.appendChild(wordItem);
                });
            })
            .catch(error => console.error('Error loading wordbank:', error));
    }

    // 搜索单词
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const wordItems = document.querySelectorAll('.word-list-item');
        wordItems.forEach(item => {
            const wordText = item.textContent.toLowerCase();
            if (wordText.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // 添加单词
    addWordBtn.addEventListener('click', () => {
        const word = newWord.value.trim();
        const pos = newPos.value.trim();
        const explanation = newExplanation.value.trim();

        if (!word || !pos || !explanation) {
            alert('请填写所有字段');
            return;
        }

        fetch('http://localhost:3000/api/words', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word, pos, explanation })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadWordbank();
            newWord.value = '';
            newPos.value = '';
            newExplanation.value = '';
        })
        .catch(error => console.error('Error adding word:', error));
    });

    // 删除单词
    window.deleteWord = function(word) {
        fetch(`http://localhost:3000/api/words/${word}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadWordbank();
        })
        .catch(error => console.error('Error deleting word:', error));
    };

    // 页面加载时加载单词库
    loadWordbank();
});

document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('messageList');
    const messageInput = document.getElementById('messageInput');
    const submitMessageBtn = document.getElementById('submitMessageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    const leaderboardLink = document.querySelector('a[data-section="leaderboardSection"]');

    let currentPage = 1;
    const messagesPerPage = 5;

    if (leaderboardLink) {
        leaderboardLink.addEventListener('click', loadLeaderboard);
    }
    // 加载留言
    function loadMessages(page) {
        fetch(`http://localhost:3000/api/messages?page=${page}&limit=${messagesPerPage}`)
            .then(response => response.json())
            .then(data => {
                messageList.innerHTML = '';
                data.messages.forEach(message => {
                    const messageItem = document.createElement('div');
                    messageItem.className = 'message-item';
                    messageItem.innerHTML = `
                        <div class="message-content">
                            <span class="message-author">${message.account}:</span>
                            <span class="message-text">${message.content}</span>
                        </div>
                        <div class="message-actions">
                            <button onclick="likeMessage('${message.id}')">点赞 (${message.likes})</button>
                            <button onclick="showReplyForm('${message.id}')">回复</button>
                            ${message.replies && message.replies.length > 0 ? 
                                `<button class="show-replies-btn" onclick="toggleReplies('${message.id}')">查看回复(${message.replies.length})</button>`:''
                            }
                        </div>
                        <div class="reply-section" style="display: none;">
                            <div id="replyForm-${message.id}" class="reply-form">
                                <input type="text" id="replyInput-${message.id}" placeholder="回复内容">
                                <button onclick="replyToMessage('${message.id}')">提交回复</button>
                            </div>
                            <div id="replies-${message.id}" class="replies-container">
                                ${message.replies ? message.replies.map(reply => `
                                    <div class="reply-item">
                                        <span class="reply-author">${reply.account}:</span>
                                        <span class="reply-text">${reply.content}</span>
                                    </div>
                                `).join(''):''}
                            </div>
                        </div>
                    `;
                    messageList.appendChild(messageItem);
                });
                pageInfo.textContent = `第 ${page} 页，共 ${data.totalPages} 页`;
                currentPage = page;
                prevPageBtn.disabled = page === 1;
                nextPageBtn.disabled = page === data.totalPages;
            })
            .catch(error => console.error('Error loading messages:', error));
    }
    function loadLeaderboard() {
        fetch('http://localhost:3000/api/leaderboard')
            .then(response => response.json())
            .then(data => {
                const leaderboardBody = document.getElementById('leaderboardBody');
                leaderboardBody.innerHTML = '';  // 清空之前的内容
    
                data.forEach((user, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${user.account}</td>
                        <td>${user.points}</td>
                    `;
                    leaderboardBody.appendChild(row);
                });
            })
            .catch(error => console.error('加载排行榜时出错:', error));
    }

    // 显示回复表单
    window.showReplyForm = function(messageId) {
        const replySection = document.querySelector(`#replyForm-${messageId}`).closest('.reply-section');
        replySection.style.display = replySection.style.display === 'none' ? 'block' : 'none';
    }

    // 提交回复
    window.replyToMessage = function(messageId) {
        const replyInput = document.getElementById(`replyInput-${messageId}`);
        const content = replyInput.value.trim();

        if (!content) {
            alert('回复内容不能为空');
            return;
        }

        const account = localStorage.getItem('account');
        fetch(`http://localhost:3000/api/messages/${messageId}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, account })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadMessages(currentPage);
            replyInput.value = '';
        })
        .catch(error => console.error('Error submitting reply:', error));
    }

    // 切换回复显示
    window.toggleReplies = function(messageId) {
        const repliesContainer = document.getElementById(`replies-${messageId}`);
        const replySection = repliesContainer.closest('.reply-section');
        const showRepliesBtn = replySection.previousElementSibling.querySelector('.show-replies-btn');
        
        if (replySection.style.display === 'none') {
            replySection.style.display = 'block';
            showRepliesBtn.textContent = '隐藏回复';
        } else {
            replySection.style.display = 'none';
            showRepliesBtn.textContent = `查看回复 (${repliesContainer.children.length})`;
        }
    }

    // 提交留言
    submitMessageBtn.addEventListener('click', () => {
        const content = messageInput.value.trim();
        const account = localStorage.getItem('account');

        if (!content) {
            alert('留言内容不能为空');
            return;
        }

        fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, account })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadMessages(currentPage);
            messageInput.value = '';
        })
        .catch(error => console.error('Error submitting message:', error));
    });

    // 点赞留言
    window.likeMessage = function(messageId) {
        fetch(`http://localhost:3000/api/messages/${messageId}/like`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadMessages(currentPage);
        })
        .catch(error => console.error('Error liking message:', error));
    };

    // 分页按钮点击事件
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            loadMessages(currentPage - 1);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        loadMessages(currentPage + 1);
    });

    // 页面加载时加载留言
    loadMessages(currentPage);
});

// 个人主页功能
function loadUserProfile() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const account = localStorage.getItem('account');
    
    if (isLoggedIn !== 'true' || !account) {
        alert('没检测到你的登陆信息咧，大概率代码又出问题了，，，');
        window.location.href = '/public/index.html'; // 重定向到登录页面
        return;
    }

    // 加载用户信息
    fetch(`http://localhost:3000/api/users/${account}`)
        .then(response => response.json())
        .then(data => {
            // 更新个人主页的 UI
            document.getElementById('profileName').textContent = data.name || '还没改名的小宝宝';
            document.getElementById('profilePoints').textContent = data.points;
            if (data.avatar) {
                document.getElementById('userAvatar').src = data.avatar;
            }
        })
        .catch(error => console.error('加载用户信息时出错:', error));

    // 获取用户留言
    fetch(`http://localhost:3000/api/messages?account=${account}`)
        .then(response => response.json())
        .then(data => {
            const userMessageList = document.getElementById('userMessageList');
            userMessageList.innerHTML = '';
            data.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.textContent = message.content;
                userMessageList.appendChild(messageElement);
            });
        })
        .catch(error => console.error('获取用户留言失败:', error));
}

function loadUserMessages(account) {
    fetch(`http://localhost:3000/api/messages?account=${account}`)
        .then(response => response.json())
        .then(data => {
            const userMessageList = document.getElementById('userMessageList');
            userMessageList.innerHTML = '';
            data.messages.forEach(message => {
                const messageItem = createMessageElement(message);
                userMessageList.appendChild(messageItem);
            });
        })
        .catch(error => console.error('Error loading user messages:', error));
}

document.getElementById('changePasswordBtn').addEventListener('click', () => {
    const newPassword = prompt('请输入新密码：');
    if (newPassword) {
        const account = localStorage.getItem('account');
        fetch(`http://localhost:3000/api/users/${account}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error changing password:', error));
    }
});

document.getElementById('changeAvatarBtn').addEventListener('click', () => {
    // 这里应该实现文件上传功能，为简化示例，我们使用一个 URL 输入
    const newAvatarUrl = prompt('请输入新头像的 URL：');
    if (newAvatarUrl) {
        const account = localStorage.getItem('account');
        fetch(`http://localhost:3000/api/users/${account}/avatar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatarUrl: newAvatarUrl })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('userAvatar').src = newAvatarUrl;
        })
        .catch(error => console.error('Error changing avatar:', error));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const profileLink = document.querySelector('a[data-section="profileSection"]');
    if (profileLink) {
        profileLink.addEventListener('click', loadUserProfile);
    }

    // 检查登录状态并加载用户信息
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        loadUserProfile();
    }
});


document.getElementById('logoutBtn').addEventListener('click', logout);



document.getElementById('changeNameBtn').addEventListener('click', () => {
    const newName = prompt('请输入新名称：');
    if (newName) {
        const account = localStorage.getItem('account');
        fetch(`http://localhost:3000/api/users/${account}/name`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newName })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('userName').textContent = newName;
        })
        .catch(error => console.error('Error changing name:', error));
    }
});

document.getElementById('deleteAccountBtn').addEventListener('click', () => {
    if (confirm('确定要注销账户吗？此操作不可逆！')) {
        const account = localStorage.getItem('account');
        fetch(`http://localhost:3000/api/users/${account}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('account');
            window.location.href = '/public/index.html';
        })
        .catch(error => console.error('Error deleting account:', error));
    }
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('account');
    window.location.href = '/public/index.html';
}
document.getElementById('logoutBtn').addEventListener('click', logout);

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('account');
    window.location.href = '/public/index.html';
});

// 在页面加载时调用 loadUserProfile
document.addEventListener('DOMContentLoaded', () => {
    // ... 其他初始化代码 ...
    if (window.location.hash === '#profileSection') {
        loadUserProfile();
    }
    const profileLink = document.querySelector('a[data-section="profileSection"]');
    if (profileLink) {
        profileLink.addEventListener('click', loadUserProfile);
    }
});

function loadUserProfile() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const account = localStorage.getItem('account');
    if (isLoggedIn !== 'true' || !account) {
        alert('请先登录');
        window.location.href = 'index.html'; // 重定向到登录页面
        return;
    }

    fetch(`http://localhost:3000/api/users/${account}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').textContent = data.name || '还没改名的小宝宝';
            document.getElementById('userAccount').textContent = `账号：${data.account}`;
            if (data.avatar) {
                document.getElementById('userAvatar').src = data.avatar;
            }
        })
        .catch(error => console.error('获取用户信息失败:', error));

    // 获取用户留言
    fetch(`http://localhost:3000/api/messages?account=${account}`)
        .then(response => response.json())
        .then(data => {
            const userMessageList = document.getElementById('userMessageList');
            userMessageList.innerHTML = '';
            data.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.textContent = message.content;
                userMessageList.appendChild(messageElement);
            });
        })
        .catch(error => console.error('获取用户留言失败:', error));
}

// 在 DOMContentLoaded 事件中添加对 loadUserProfile 的调用
document.addEventListener('DOMContentLoaded', () => {
    // ... 现有的代码 ...
    const profileLink = document.querySelector('a[data-section="profileSection"]');
    if (profileLink) {
        profileLink.addEventListener('click', loadUserProfile);
    }
});

function replyToMessage(messageId) {
    const content = prompt('请输入回复内容：');
    if (content) {
        const account = localStorage.getItem('account');
        fetch(`http://localhost:3000/api/messages/${messageId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, account }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // 刷新留言列表
            loadMessages();
        })
        .catch(error => console.error('回复失败:', error));
    }
}

// 在导航到个人主页时加载用户信息
document.querySelector('nav a[data-section="profileSection"]').addEventListener('click', loadUserProfile);

