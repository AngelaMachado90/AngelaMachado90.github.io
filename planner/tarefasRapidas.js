// Variáveis globais
let tasks = [];
let currentTaskToDelete = null;
let timerInterval = null;
let timerSeconds = 25 * 60;
let isTimerRunning = false;
const MAX_QUICK_TASKS = 3;

// Elementos DOM - Corrigidos
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingTasksContainer = document.getElementById('pendingTasks');
const activeTasksContainer = document.getElementById('activeTasks');
const completedTasksContainer = document.getElementById('completedTasks');
const pomodoroModal = new bootstrap.Modal(document.getElementById('pomodoroModal'));
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const timerDisplay = document.getElementById('timerDisplay');
const timerProgress = document.getElementById('timerProgress');
const startTimerBtn = document.getElementById('startTimerBtn');
const pauseTimerBtn = document.getElementById('pauseTimerBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const currentPomodoroTask = document.getElementById('currentPomodoroTask');

// Funções
function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        if (tasks.filter(task => task.status === 'pending').length >= MAX_QUICK_TASKS) {
            alert(`Você só pode adicionar ${MAX_QUICK_TASKS} tarefas rápidas!`);
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            status: 'pending'
        };
        tasks.push(task);
        newTaskInput.value = '';
        renderTasks();
        updateAddButtonState();
    }
}

function updateAddButtonState() {
    const pendingTasksCount = tasks.filter(task => task.status === 'pending').length;
    addTaskBtn.disabled = pendingTasksCount >= MAX_QUICK_TASKS;
    newTaskInput.placeholder = pendingTasksCount >= MAX_QUICK_TASKS 
        ? 'Limite de tarefas atingido' 
        : 'Digite uma nova tarefa';
}

function renderTasks() {
    // Limpar containers mantendo a estrutura
    pendingTasksContainer.innerHTML = '<h3><i class="bi bi-hourglass"></i> Pendentes</h3>';
    activeTasksContainer.innerHTML = '<h3><i class="bi bi-play-circle"></i> Em Andamento</h3>';
    completedTasksContainer.innerHTML = '<h3><i class="bi bi-check-circle"></i> Concluídas</h3>';

    // Adicionar empty state se necessário
    if (tasks.filter(task => task.status === 'pending').length === 0) {
        pendingTasksContainer.innerHTML += '<div class="empty-state">Nenhuma tarefa pendente</div>';
    }
    if (tasks.filter(task => task.status === 'active').length === 0) {
        activeTasksContainer.innerHTML += '<div class="empty-state">Nenhuma tarefa em andamento</div>';
    }
    if (tasks.filter(task => task.status === 'completed').length === 0) {
        completedTasksContainer.innerHTML += '<div class="empty-state">Nenhuma tarefa concluída</div>';
    }

    // Função auxiliar para criar itens de tarefa
    const createTaskElement = (task, actionsHTML) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.status === 'completed' ? 'completed-task' : ''}`;
        taskElement.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                ${actionsHTML}
            </div>
        `;
        return taskElement;
    };

    // Renderizar tarefas
    tasks.forEach(task => {
        let container, actionsHTML;
        
        switch(task.status) {
            case 'pending':
                container = pendingTasksContainer;
                actionsHTML = `
                    <button class="task-btn btn-start start-task" data-id="${task.id}">
                        <i class="bi bi-play-fill"></i> Iniciar
                    </button>
                    <button class="task-btn btn-delete remove-task" data-id="${task.id}">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                `;
                break;
            case 'active':
                container = activeTasksContainer;
                actionsHTML = `
                    <button class="task-btn btn-start resume-task" data-id="${task.id}">
                        <i class="bi bi-arrow-repeat"></i> Retomar
                    </button>
                    <button class="task-btn btn-complete complete-task" data-id="${task.id}">
                        <i class="bi bi-check-circle"></i> Concluir
                    </button>
                    <button class="task-btn btn-delete remove-task" data-id="${task.id}">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                `;
                break;
            case 'completed':
                container = completedTasksContainer;
                actionsHTML = `
                    <button class="task-btn btn-delete remove-task" data-id="${task.id}">
                        <i class="bi bi-trash"></i> Remover
                    </button>
                `;
                break;
        }

        if (container) {
            const taskElement = createTaskElement(task, actionsHTML);
            // Inserir antes do empty state se existir
            const emptyState = container.querySelector('.empty-state');
            if (emptyState) {
                container.insertBefore(taskElement, emptyState);
            } else {
                container.appendChild(taskElement);
            }
        }
    });

    // Adicionar event listeners
    addTaskListeners();
}

// ... (o restante das funções permanece igual)

// Event Listeners - Modificado para delegar eventos
document.addEventListener('click', (e) => {
    if (e.target.closest('.start-task')) {
        const taskId = parseInt(e.target.closest('.start-task').getAttribute('data-id'));
        startTask(taskId);
    }
    
    if (e.target.closest('.resume-task')) {
        const taskId = parseInt(e.target.closest('.resume-task').getAttribute('data-id'));
        resumeTask(taskId);
    }
    
    if (e.target.closest('.complete-task')) {
        const taskId = parseInt(e.target.closest('.complete-task').getAttribute('data-id'));
        completeTask(taskId);
    }
    
    if (e.target.closest('.remove-task')) {
        const taskId = parseInt(e.target.closest('.remove-task').getAttribute('data-id'));
        showDeleteConfirmation(taskId);
    }
});

addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

confirmDeleteBtn.addEventListener('click', deleteTask);

startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();
    updateAddButtonState();
});