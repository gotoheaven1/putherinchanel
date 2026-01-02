// 상태 관리 (localStorage에서 로드)
let appData = JSON.parse(localStorage.getItem('focusAppData')) || {
    theme: 'light',
    todos: [],
    studyHistory: {} // 형식: "YYYY-MM-DD": seconds
};

let timerInterval;
let seconds = 0;
let isRunning = false;
let todayKey = new Date().toISOString().split('T')[0];

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    renderTodos();
    renderCalendar();
    updateTodayTotal();
    
    // 이전에 타이머가 멈춘 시점의 오늘 누적 시간이 있다면 표시는 안하되 데이터는 유지
});

/* --- 1. 탭 전환 기능 --- */
function switchTab(tabId) {
    // 탭 UI 변경
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active'); // 클릭된 요소 활성화

    // 컨텐츠 변경
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    // 달력 탭이면 달력 리렌더링
    if(tabId === 'calendar') renderCalendar();
}

/* --- 2. 타이머 기능 --- */
function formatTime(sec) {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    document.getElementById('start-btn').disabled = true;
    document.getElementById('pause-btn').disabled = false;
    document.querySelector('.hero-image img').style.filter = "grayscale(100%) opacity(0.5)"; // 집중 모드 시각효과

    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('stopwatch').innerText = formatTime(seconds);
        
        // 실시간으로 오늘의 데이터 업데이트 (비정상 종료 대비)
        saveStudyTime(1); 
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById('start-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
    document.querySelector('.hero-image img').style.filter = "grayscale(100%)";
    
    // 타이머 화면 초기화 (누적은 saveStudyTime에서 처리됨)
    seconds = 0;
    document.getElementById('stopwatch').innerText = "00:00:00";
    saveData();
}

function saveStudyTime(addSeconds) {
    if (!appData.studyHistory[todayKey]) {
        appData.studyHistory[todayKey] = 0;
    }
    appData.studyHistory[todayKey] += addSeconds;
    updateTodayTotal();
    saveData();
}

function updateTodayTotal() {
    const total = appData.studyHistory[todayKey] || 0;
    document.getElementById('today-total').innerText = formatTime(total);
}

/* --- 3. Todo List 기능 --- */
function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;

    appData.todos.push({ text, completed: false });
    input.value = '';
    renderTodos();
    saveData();
}

function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    appData.todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <i class="ph ${todo.completed ? 'ph-check-square' : 'ph-square'} check-btn" onclick="toggleTodo(${index})"></i>
            <span>${todo.text}</span>
            <i class="ph ph-trash del-btn" onclick="deleteTodo(${index})"></i>
        `;
        list.appendChild(li);
    });
}

function toggleTodo(index) {
    appData.todos[index].completed = !appData.todos[index].completed;
    renderTodos();
    saveData();
}

function deleteTodo(index) {
    appData.todos.splice(index, 1);
    renderTodos();
    saveData();
}

/* --- 4. 달력 기능 --- */
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYear = document.getElementById('month-year');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    monthYear.innerText = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement('div'));
    }

    // 날짜 채우기
    for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-cell';
        dayDiv.innerText = d;
        
        // 날짜 키 생성 (YYYY-MM-DD) - 로컬 시간 기준 보정
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        
        // 공부 기록이 있으면 강조
        if (appData.studyHistory[dateKey] > 0) {
            dayDiv.style.border = "1px solid var(--text-color)";
        }

        // 오늘 날짜
        if (dateKey === todayKey) {
            dayDiv.classList.add('active-day');
        }

        dayDiv.onclick = () => showReport(dateKey);
        grid.appendChild(dayDiv);
    }
}

function showReport(dateKey) {
    const seconds = appData.studyHistory[dateKey] || 0;
    document.getElementById('selected-date-info').innerText = dateKey;
    document.getElementById('selected-study-time').innerText = formatTime(seconds);
}

/* --- 5. 테마 및 데이터 저장 --- */
function toggleTheme() {
    appData.theme = appData.theme === 'light' ? 'dark' : 'light';
    loadTheme();
    saveData();
}

function loadTheme() {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    if (appData.theme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('ph-moon', 'ph-sun');
    } else {
        body.classList.remove('dark-mode');
        icon.classList.replace('ph-sun', 'ph-moon');
    }
}

function saveData() {
    localStorage.setItem('focusAppData', JSON.stringify(appData));
}

function resetData() {
    if(confirm("Are you sure? All study data will be lost.")) {
        localStorage.removeItem('focusAppData');
        location.reload();
    }
}