// Variáveis globais
let tasks = [];
let currentTaskToDelete = null;
let timerInterval = null;
let timerSeconds = 25 * 60; // 25 minutos em segundos
let isTimerRunning = false;

// Elementos DOM
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingTasksList = document.getElementById('pendingTasks');
const activeTasksList = document.getElementById('activeTasks');
const emptyState = document.getElementById('emptyState');
const activeEmptyState = document.getElementById('activeEmptyState');
const pomodoroModal = new bootstrap.Modal(document.getElementById('pomodoroModal'));
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const timerDisplay = document.getElementById('timerDisplay');
const timerProgress = document.getElementById('timerProgress');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Funções
function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            status: 'pending'
        };
        tasks.push(task);
        newTaskInput.value = '';
        renderTasks();
    }
}

function renderTasks() {
    // Limpar listas
    pendingTasksList.querySelectorAll('.task-item').forEach(el => el.remove());
    activeTasksList.querySelectorAll('.task-item').forEach(el => el.remove());

    // Filtrar tarefas
    const pending = tasks.filter(task => task.status === 'pending');
    const active = tasks.filter(task => task.status === 'active');

    // Mostrar/ocultar empty states
    emptyState.style.display = pending.length ? 'none' : 'block';
    activeEmptyState.style.display = active.length ? 'none' : 'block';

    // Renderizar tarefas pendentes
    pending.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="btn btn-sm btn-success start-task" data-id="${task.id}">
                    <i class="bi bi-play-fill"></i> Iniciar
                </button>
                <button class="btn btn-sm btn-danger remove-task" data-id="${task.id}">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </div>
        `;
        pendingTasksList.appendChild(taskElement);
    });

    // Renderizar tarefas ativas
    active.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="btn btn-sm btn-danger remove-task" data-id="${task.id}">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </div>
        `;
        activeTasksList.appendChild(taskElement);
    });

    // Adicionar event listeners
    document.querySelectorAll('.start-task').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id'));
            startTask(taskId);
        });
    });

    document.querySelectorAll('.remove-task').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id'));
            showDeleteConfirmation(taskId);
        });
    });
}

function startTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = 'active';
        renderTasks();
        updateTimerDisplay();
        pomodoroModal.show();
    }
}

function showDeleteConfirmation(taskId) {
    currentTaskToDelete = taskId;
    confirmDeleteModal.show();
}

function deleteTask() {
    tasks = tasks.filter(task => task.id !== currentTaskToDelete);
    renderTasks();
    confirmDeleteModal.hide();
    currentTaskToDelete = null;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Atualizar barra de progresso
    const totalSeconds = 25 * 60;
    const progress = (timerSeconds / totalSeconds) * 100;
    timerProgress.style.width = `${progress}%`;
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        startTimerBtn.style.display = 'none';
        pauseTimerBtn.style.display = 'inline-block';
        
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                alert('Tempo do Pomodoro acabou!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startTimerBtn.style.display = 'inline-block';
        pauseTimerBtn.style.display = 'none';
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

confirmDeleteBtn.addEventListener('click', deleteTask);

startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Inicializar
updateTimerDisplay();