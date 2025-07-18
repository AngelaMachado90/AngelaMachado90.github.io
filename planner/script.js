document.addEventListener('DOMContentLoaded', function () {
    // Variáveis globais
    let pomodoroInterval;
    let pomodoroTime = 25 * 60; // 25 minutos em segundos
    let isPomodoroRunning = false;
    let currentTaskIndex = -1;
    let quickTasks = [];

    // Definir a data atual como padrão
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('currentDate').value = dateString;

    // Carregar dados salvos
    loadSavedData();

    // Event listeners para os botões principais
    document.getElementById('saveBtn').addEventListener('click', saveAllData);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    document.getElementById('exportCalendarBtn').addEventListener('click', exportToGoogleCalendar);
    document.getElementById('addQuickTask').addEventListener('click', addQuickTaskField);

    // Event listeners para o Pomodoro
    document.getElementById('startPomodoro').addEventListener('click', startPomodoro);
    document.getElementById('pausePomodoro').addEventListener('click', pausePomodoro);
    document.getElementById('resetPomodoro').addEventListener('click', resetPomodoro);

    // Event listeners para os botões de salvar por seção
    document.querySelectorAll('.save-section-btn').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            saveSectionData(section);
        });
    });

    // Função para adicionar nova tarefa rápida
    function addQuickTaskField() {
        const container = document.getElementById('quickTasksContainer');
        const taskId = Date.now(); // ID único para cada tarefa
        
        const taskDiv = document.createElement('div');
        taskDiv.className = 'quick-task-item';
        taskDiv.dataset.taskId = taskId;
        
        taskDiv.innerHTML = `
            <input type="text" class="quick-task-input" placeholder="Descreva a tarefa rápida">
            <div class="task-actions">
                <button class="start-task-btn" data-task-id="${taskId}">
                    <i class="bi bi-play-fill"></i> Iniciar
                </button>
                <button class="delete-task-btn" data-task-id="${taskId}">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </div>
        `;
        
        container.appendChild(taskDiv);
        
        // Adiciona eventos aos novos botões
        taskDiv.querySelector('.start-task-btn').addEventListener('click', function() {
            startTaskForPomodoro(taskId);
        });
        
        taskDiv.querySelector('.delete-task-btn').addEventListener('click', function() {
            showDeleteConfirmation(taskId);
        });
        
        // Foca no campo de input recém-criado
        taskDiv.querySelector('input').focus();
    }

    // Função para mostrar confirmação de exclusão
    function showDeleteConfirmation(taskId) {
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <h4>Confirmar Exclusão</h4>
                <p>Tem certeza que deseja remover esta tarefa?</p>
                <div class="confirmation-buttons">
                    <button id="confirmDelete">Sim, Remover</button>
                    <button id="cancelDelete">Cancelar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        document.getElementById('confirmDelete').addEventListener('click', function() {
            removeQuickTask(taskId);
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });
        
        document.getElementById('cancelDelete').addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });
    }

    // Função para remover tarefa rápida
    function removeQuickTask(taskId) {
        const taskElement = document.querySelector(`.quick-task-item[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
        }
        
        // Remove da lista de tarefas se estiver salva
        quickTasks = quickTasks.filter(task => task.id !== taskId);
        updateSavedItemsList('quickTasks');
    }

    // Função para iniciar tarefa no Pomodoro
    function startTaskForPomodoro(taskId) {
        const taskElement = document.querySelector(`.quick-task-item[data-task-id="${taskId}"]`);
        const taskInput = taskElement.querySelector('.quick-task-input');
        const taskText = taskInput ? taskInput.value.trim() : taskElement.querySelector('.completed-task-text').textContent;
        
        if (!taskText) {
            alert('Por favor, insira uma descrição para a tarefa.');
            return;
        }
        
        // Remove destaque de qualquer tarefa anterior
        document.querySelectorAll('.quick-task-item').forEach(item => {
            item.classList.remove('task-in-progress');
        });
        
        // Destaca a tarefa atual
        taskElement.classList.add('task-in-progress');
        
        // Atualiza a tarefa atual no Pomodoro
        currentTaskIndex = Array.from(document.querySelectorAll('.quick-task-item')).findIndex(
            item => item.dataset.taskId === taskId
        );
        
        document.getElementById('currentTask').textContent = `Tarefa: ${taskText}`;
        document.getElementById('pomodoroModal').style.display = 'flex';
        resetPomodoro();
    }

    // Funções do Pomodoro
    function startPomodoro() {
        if (isPomodoroRunning) return;
        
        isPomodoroRunning = true;
        pomodoroInterval = setInterval(updatePomodoro, 1000);
    }

    function pausePomodoro() {
        isPomodoroRunning = false;
        clearInterval(pomodoroInterval);
    }

    function resetPomodoro() {
        pausePomodoro();
        pomodoroTime = 25 * 60; // Reset para 25 minutos
        updateTimerDisplay();
    }

    function updatePomodoro() {
        pomodoroTime--;
        updateTimerDisplay();
        
        if (pomodoroTime <= 0) {
            pausePomodoro();
            showPomodoroCompletion();
        }
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(pomodoroTime / 60);
        const seconds = pomodoroTime % 60;
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function showPomodoroCompletion() {
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <h4>Pomodoro Concluído!</h4>
                <p>A tarefa foi completada?</p>
                <div class="confirmation-buttons">
                    <button id="taskCompleted">Sim</button>
                    <button id="taskNotCompleted">Não</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        document.getElementById('taskCompleted').addEventListener('click', function() {
            markTaskAsCompleted();
            modal.style.display = 'none';
            document.body.removeChild(modal);
            document.getElementById('pomodoroModal').style.display = 'none';
        });
        
        document.getElementById('taskNotCompleted').addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });
    }

    function markTaskAsCompleted() {
        if (currentTaskIndex === -1) return;
        
        const taskElements = document.querySelectorAll('.quick-task-item');
        if (currentTaskIndex >= 0 && currentTaskIndex < taskElements.length) {
            const taskElement = taskElements[currentTaskIndex];
            taskElement.classList.remove('task-in-progress');
            taskElement.classList.add('task-completed');
            
            // Adiciona ícone de concluído
            const taskText = taskElement.querySelector('.quick-task-input') ? 
                taskElement.querySelector('.quick-task-input').value :
                taskElement.querySelector('.completed-task-text').textContent;
                
            taskElement.innerHTML = `
                <span class="completed-task-text">${taskText}</span>
                <div class="task-actions">
                    <button class="delete-task-btn">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            `;
            
            // Adiciona evento de delete novamente
            taskElement.querySelector('.delete-task-btn').addEventListener('click', function() {
                showDeleteConfirmation(taskElement.dataset.taskId);
            });
        }
        
        currentTaskIndex = -1;
    }

    // Função para salvar todos os dados
    function saveAllData() {
        const plannerData = collectAllData();
        localStorage.setItem('dailyPlannerData', JSON.stringify(plannerData));
        alert('Todos os dados foram salvos com sucesso!');
        loadSavedData(); // Atualiza as listas de itens salvos
    }

    // Função para salvar uma seção específica
    function saveSectionData(section) {
        const plannerData = JSON.parse(localStorage.getItem('dailyPlannerData')) || {};
        const today = new Date().toISOString().split('T')[0];
        
        // Atualiza a data sempre que salvar
        plannerData.date = document.getElementById('currentDate').value || today;
        
        switch(section) {
            case 'priorities':
                plannerData.priorities = document.getElementById('priorities').value;
                break;
            case 'quickTasks':
                quickTasks = [];
                document.querySelectorAll('.quick-task-item').forEach(taskElement => {
                    const taskInput = taskElement.querySelector('.quick-task-input');
                    if (taskInput) {
                        quickTasks.push({
                            id: taskElement.dataset.taskId,
                            text: taskInput.value,
                            completed: taskElement.classList.contains('task-completed')
                        });
                    } else {
                        // Para tarefas já completadas (que não têm mais input)
                        const taskText = taskElement.querySelector('.completed-task-text').textContent;
                        quickTasks.push({
                            id: taskElement.dataset.taskId,
                            text: taskText,
                            completed: true
                        });
                    }
                });
                plannerData.quickTasks = quickTasks;
                break;
            case 'notes':
                plannerData.notes = document.getElementById('notes').value;
                break;
            case 'weekNotes':
                plannerData.weekNotes = document.getElementById('weekNotes').value;
                break;
            case 'breakfast':
            case 'lunch':
            case 'dinner':
                if (!plannerData.meals) plannerData.meals = {};
                plannerData.meals[section] = document.getElementById(section).value;
                break;
            case 'actions':
                plannerData.actions = [];
                for (let i = 1; i <= 10; i++) {
                    plannerData.actions.push(document.getElementById(`action${i}`).value);
                }
                break;
            case 'otherTasks':
                plannerData.otherTasks = [];
                for (let i = 1; i <= 5; i++) {
                    plannerData.otherTasks.push(document.getElementById(`otherTask${i}`).value);
                }
                break;
            case 'reminders':
                plannerData.reminders = [];
                for (let i = 1; i <= 5; i++) {
                    plannerData.reminders.push(document.getElementById(`reminder${i}`).value);
                }
                break;
        }

        localStorage.setItem('dailyPlannerData', JSON.stringify(plannerData));
        updateSavedItemsList(section);
        alert(`Seção "${getSectionName(section)}" salva com sucesso!`);
    }

    // Função para coletar todos os dados
    function collectAllData() {
        // Coletar tarefas rápidas
        quickTasks = [];
        document.querySelectorAll('.quick-task-item').forEach(taskElement => {
            const taskInput = taskElement.querySelector('.quick-task-input');
            if (taskInput) {
                quickTasks.push({
                    id: taskElement.dataset.taskId,
                    text: taskInput.value,
                    completed: taskElement.classList.contains('task-completed')
                });
            } else {
                const taskText = taskElement.querySelector('.completed-task-text').textContent;
                quickTasks.push({
                    id: taskElement.dataset.taskId,
                    text: taskText,
                    completed: true
                });
            }
        });

        return {
            date: document.getElementById('currentDate').value,
            priorities: document.getElementById('priorities').value,
            quickTasks: quickTasks,
            notes: document.getElementById('notes').value,
            weekNotes: document.getElementById('weekNotes').value,
            meals: {
                breakfast: document.getElementById('breakfast').value,
                lunch: document.getElementById('lunch').value,
                dinner: document.getElementById('dinner').value
            },
            actions: [
                document.getElementById('action1').value,
                document.getElementById('action2').value,
                document.getElementById('action3').value,
                document.getElementById('action4').value,
                document.getElementById('action5').value,
                document.getElementById('action6').value,
                document.getElementById('action7').value,
                document.getElementById('action8').value,
                document.getElementById('action9').value,
                document.getElementById('action10').value
            ],
            otherTasks: [
                document.getElementById('otherTask1').value,
                document.getElementById('otherTask2').value,
                document.getElementById('otherTask3').value,
                document.getElementById('otherTask4').value,
                document.getElementById('otherTask5').value
            ],
            reminders: [
                document.getElementById('reminder1').value,
                document.getElementById('reminder2').value,
                document.getElementById('reminder3').value,
                document.getElementById('reminder4').value,
                document.getElementById('reminder5').value
            ]
        };
    }

    // Função para carregar dados salvos
    function loadSavedData() {
        const savedData = localStorage.getItem('dailyPlannerData');
        if (savedData) {
            const plannerData = JSON.parse(savedData);

            // Verificar se os dados salvos são do mesmo dia
            const today = new Date().toISOString().split('T')[0];
            if (plannerData.date === today) {
                document.getElementById('currentDate').value = plannerData.date;
                
                // Carrega os dados e atualiza as listas
                if (plannerData.priorities) {
                    document.getElementById('priorities').value = plannerData.priorities;
                    updateSavedItemsList('priorities');
                }

                if (plannerData.quickTasks) {
                    const container = document.getElementById('quickTasksContainer');
                    container.innerHTML = '';
                    
                    plannerData.quickTasks.forEach(task => {
                        const taskDiv = document.createElement('div');
                        taskDiv.className = `quick-task-item ${task.completed ? 'task-completed' : ''}`;
                        taskDiv.dataset.taskId = task.id;
                        
                        if (task.completed) {
                            taskDiv.innerHTML = `
                                <span class="completed-task-text">${task.text}</span>
                                <div class="task-actions">
                                    <button class="delete-task-btn">
                                        <i class="bi bi-trash-fill"></i>
                                    </button>
                                </div>
                            `;
                        } else {
                            taskDiv.innerHTML = `
                                <input type="text" class="quick-task-input" value="${task.text}" placeholder="Descreva a tarefa rápida">
                                <div class="task-actions">
                                    <button class="start-task-btn" data-task-id="${task.id}">
                                        <i class="bi bi-play-fill"></i> Iniciar
                                    </button>
                                    <button class="delete-task-btn" data-task-id="${task.id}">
                                        <i class="bi bi-trash-fill"></i>
                                    </button>
                                </div>
                            `;
                        }
                        
                        container.appendChild(taskDiv);
                        
                        // Adiciona eventos
                        const startBtn = taskDiv.querySelector('.start-task-btn');
                        if (startBtn) {
                            startBtn.addEventListener('click', function() {
                                startTaskForPomodoro(task.id);
                            });
                        }
                        
                        const deleteBtn = taskDiv.querySelector('.delete-task-btn');
                        if (deleteBtn) {
                            deleteBtn.addEventListener('click', function() {
                                showDeleteConfirmation(task.id);
                            });
                        }
                    });
                    
                    updateSavedItemsList('quickTasks');
                }

                if (plannerData.notes) {
                    document.getElementById('notes').value = plannerData.notes;
                    updateSavedItemsList('notes');
                }

                if (plannerData.weekNotes) {
                    document.getElementById('weekNotes').value = plannerData.weekNotes;
                    updateSavedItemsList('weekNotes');
                }

                if (plannerData.meals) {
                    document.getElementById('breakfast').value = plannerData.meals.breakfast || '';
                    document.getElementById('lunch').value = plannerData.meals.lunch || '';
                    document.getElementById('dinner').value = plannerData.meals.dinner || '';
                    updateSavedItemsList('breakfast');
                    updateSavedItemsList('lunch');
                    updateSavedItemsList('dinner');
                }

                if (plannerData.actions && plannerData.actions.length >= 10) {
                    for (let i = 0; i < 10; i++) {
                        document.getElementById(`action${i + 1}`).value = plannerData.actions[i] || '';
                    }
                    updateSavedItemsList('actions');
                }

                if (plannerData.otherTasks && plannerData.otherTasks.length >= 5) {
                    for (let i = 0; i < 5; i++) {
                        document.getElementById(`otherTask${i + 1}`).value = plannerData.otherTasks[i] || '';
                    }
                    updateSavedItemsList('otherTasks');
                }

                if (plannerData.reminders && plannerData.reminders.length >= 5) {
                    for (let i = 0; i < 5; i++) {
                        document.getElementById(`reminder${i + 1}`).value = plannerData.reminders[i] || '';
                    }
                    updateSavedItemsList('reminders');
                }
            }
        }
    }

    // Função para atualizar a lista de itens salvos
    function updateSavedItemsList(section) {
        const savedData = JSON.parse(localStorage.getItem('dailyPlannerData')) || {};
        const listElement = document.getElementById(`${section}-list`);
        
        if (!listElement) return;
        
        listElement.innerHTML = ''; // Limpa a lista
        
        let items = [];
        
        switch(section) {
            case 'priorities':
                if (savedData.priorities) {
                    items = [savedData.priorities];
                }
                break;
            case 'quickTasks':
                if (savedData.quickTasks) {
                    items = savedData.quickTasks.filter(task => task.text.trim() !== '');
                }
                break;
            case 'notes':
                if (savedData.notes) {
                    items = [savedData.notes];
                }
                break;
            case 'weekNotes':
                if (savedData.weekNotes) {
                    items = [savedData.weekNotes];
                }
                break;
            case 'breakfast':
            case 'lunch':
            case 'dinner':
                if (savedData.meals && savedData.meals[section]) {
                    items = [savedData.meals[section]];
                }
                break;
            case 'actions':
                if (savedData.actions) {
                    items = savedData.actions.filter(action => action.trim() !== '');
                }
                break;
            case 'otherTasks':
                if (savedData.otherTasks) {
                    items = savedData.otherTasks.filter(task => task.trim() !== '');
                }
                break;
            case 'reminders':
                if (savedData.reminders) {
                    items = savedData.reminders.filter(reminder => reminder.trim() !== '');
                }
                break;
        }
        
        if (items.length === 0) {
            listElement.innerHTML = '<p style="color:#777; font-style:italic;">Nenhum item salvo ainda</p>';
            return;
        }
        
        items.forEach((item, index) => {
            let itemText = typeof item === 'object' ? item.text : item;
            if (itemText.trim() === '') return;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'saved-item';
            
            const textElement = document.createElement('span');
            textElement.textContent = itemText;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.title = 'Remover';
            deleteBtn.addEventListener('click', () => {
                removeSavedItem(section, index);
            });
            
            itemElement.appendChild(textElement);
            itemElement.appendChild(deleteBtn);
            listElement.appendChild(itemElement);
        });
    }

    // Função para remover item salvo
    function removeSavedItem(section, index) {
        const savedData = JSON.parse(localStorage.getItem('dailyPlannerData')) || {};
        
        switch(section) {
            case 'priorities':
                savedData.priorities = '';
                break;
            case 'quickTasks':
                if (savedData.quickTasks && savedData.quickTasks.length > index) {
                    savedData.quickTasks.splice(index, 1);
                    // Atualiza também o DOM se existir
                    const taskElements = document.querySelectorAll('.quick-task-item');
                    if (index < taskElements.length) {
                        taskElements[index].remove();
                    }
                }
                break;
            case 'notes':
                savedData.notes = '';
                break;
            case 'weekNotes':
                savedData.weekNotes = '';
                break;
            case 'breakfast':
            case 'lunch':
            case 'dinner':
                if (savedData.meals) {
                    savedData.meals[section] = '';
                    document.getElementById(section).value = '';
                }
                break;
            case 'actions':
                if (savedData.actions && savedData.actions.length > index) {
                    savedData.actions[index] = '';
                    document.getElementById(`action${index + 1}`).value = '';
                }
                break;
            case 'otherTasks':
                if (savedData.otherTasks && savedData.otherTasks.length > index) {
                    savedData.otherTasks[index] = '';
                    document.getElementById(`otherTask${index + 1}`).value = '';
                }
                break;
            case 'reminders':
                if (savedData.reminders && savedData.reminders.length > index) {
                    savedData.reminders[index] = '';
                    document.getElementById(`reminder${index + 1}`).value = '';
                }
                break;
        }
        
        localStorage.setItem('dailyPlannerData', JSON.stringify(savedData));
        updateSavedItemsList(section);
    }

    // Função para obter nome amigável da seção
    function getSectionName(section) {
        const names = {
            'priorities': 'Prioridades',
            'quickTasks': 'Tarefas Rápidas',
            'notes': 'Anotações',
            'weekNotes': 'Anotações da Semana',
            'breakfast': 'Café da Manhã',
            'lunch': 'Almoço',
            'dinner': 'Jantar',
            'actions': 'Plano de Ação',
            'otherTasks': 'Outras Tarefas',
            'reminders': 'Lembretes'
        };
        return names[section] || section;
    }

    // Função para limpar tudo
    function clearAll() {
        if (confirm('Tem certeza que deseja limpar todo o planner? Isso apagará todos os dados não salvos.')) {
            // Limpar todos os campos de texto
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.value = '';
            });

            const inputs = document.querySelectorAll('input[type="text"]');
            inputs.forEach(input => {
                input.value = '';
            });

            // Limpar tarefas rápidas
            document.getElementById('quickTasksContainer').innerHTML = '';
            quickTasks = [];

            // Limpar todas as listas de itens salvos
            document.querySelectorAll('.saved-items').forEach(list => {
                list.innerHTML = '';
            });

            // Definir a data atual
            const today = new Date();
            const dateString = today.toISOString().split('T')[0];
            document.getElementById('currentDate').value = dateString;
        }
    }

    // Função para exportar para Google Calendar
    function exportToGoogleCalendar() {
        // Obter a data selecionada
        const selectedDate = document.getElementById('currentDate').value;
        
        if (!selectedDate) {
            alert('Por favor, selecione uma data antes de exportar.');
            return;
        }

        // Coletar todas as tarefas e ações
        const tasks = [];
        
        // Prioridades
        const priorities = document.getElementById('priorities').value;
        if (priorities) {
            tasks.push({
                title: 'Prioridades do Dia',
                description: priorities,
                startTime: `${selectedDate}T09:00:00`,
                endTime: `${selectedDate}T09:30:00`
            });
        }

        // Tarefas rápidas
        const quickTaskElements = document.querySelectorAll('.quick-task-item');
        quickTaskElements.forEach(taskElement => {
            const taskInput = taskElement.querySelector('.quick-task-input');
            const taskText = taskInput ? taskInput.value : taskElement.querySelector('.completed-task-text').textContent;
            if (taskText.trim() !== '') {
                tasks.push({
                    title: taskText,
                    description: 'Tarefa rápida',
                    startTime: `${selectedDate}T10:00:00`,
                    endTime: `${selectedDate}T10:30:00`
                });
            }
        });

        // Plano de ação
        for (let i = 1; i <= 10; i++) {
            const action = document.getElementById(`action${i}`).value;
            if (action) {
                tasks.push({
                    title: action,
                    description: `Ação ${i} do plano`,
                    startTime: `${selectedDate}T${10 + i}:00:00`,
                    endTime: `${selectedDate}T${10 + i}:30:00`
                });
            }
        }

        // Outras tarefas
        for (let i = 1; i <= 5; i++) {
            const task = document.getElementById(`otherTask${i}`).value;
            if (task) {
                tasks.push({
                    title: task,
                    description: `Outra tarefa ${i}`,
                    startTime: `${selectedDate}T${14 + i}:00:00`,
                    endTime: `${selectedDate}T${14 + i}:30:00`
                });
            }
        }

        // Lembretes
        for (let i = 1; i <= 5; i++) {
            const reminder = document.getElementById(`reminder${i}`).value;
            if (reminder) {
                tasks.push({
                    title: reminder,
                    description: `Lembrete ${i}`,
                    startTime: `${selectedDate}T18:00:00`,
                    endTime: `${selectedDate}T18:15:00`
                });
            }
        }

        // Refeições
        const meals = {
            breakfast: document.getElementById('breakfast').value,
            lunch: document.getElementById('lunch').value,
            dinner: document.getElementById('dinner').value
        };

        if (meals.breakfast) {
            tasks.push({
                title: 'Café da manhã: ' + meals.breakfast,
                description: 'Refeição',
                startTime: `${selectedDate}T08:00:00`,
                endTime: `${selectedDate}T08:30:00`
            });
        }

        if (meals.lunch) {
            tasks.push({
                title: 'Almoço: ' + meals.lunch,
                description: 'Refeição',
                startTime: `${selectedDate}T12:00:00`,
                endTime: `${selectedDate}T13:00:00`
            });
        }

        if (meals.dinner) {
            tasks.push({
                title: 'Jantar: ' + meals.dinner,
                description: 'Refeição',
                startTime: `${selectedDate}T19:00:00`,
                endTime: `${selectedDate}T20:00:00`
            });
        }

        // Criar URL para o Google Calendar
        const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
        
        // Abrir uma nova janela para cada evento
        tasks.forEach((task, index) => {
            const eventUrl = `${baseUrl}&text=${encodeURIComponent(task.title)}` +
                            `&details=${encodeURIComponent(task.description)}` +
                            `&dates=${formatDateForGoogleCalendar(task.startTime)}` +
                            `/${formatDateForGoogleCalendar(task.endTime)}`;
            
            if (index === 0) {
                window.open(eventUrl, '_blank');
            } else {
                setTimeout(() => {
                    window.open(eventUrl, '_blank');
                }, index * 500);
            }
        });
    }

    // Função para formatar data para o Google Calendar
    function formatDateForGoogleCalendar(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    }
});