document.addEventListener('DOMContentLoaded', function () {
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

    // Event listeners para os botões de salvar por seção
    document.querySelectorAll('.save-section-btn').forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            saveSectionData(section);
        });
    });
});

function saveAllData() {
    const plannerData = collectAllData();
    localStorage.setItem('dailyPlannerData', JSON.stringify(plannerData));
    alert('Todos os dados foram salvos com sucesso!');
    loadSavedData(); // Atualiza as listas de itens salvos
}

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
            plannerData.quickTasks = [
                document.getElementById('quickTask1').value,
                document.getElementById('quickTask2').value,
                document.getElementById('quickTask3').value
            ];
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

function collectAllData() {
    return {
        date: document.getElementById('currentDate').value,
        priorities: document.getElementById('priorities').value,
        quickTasks: [
            document.getElementById('quickTask1').value,
            document.getElementById('quickTask2').value,
            document.getElementById('quickTask3').value
        ],
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

            if (plannerData.quickTasks && plannerData.quickTasks.length >= 3) {
                document.getElementById('quickTask1').value = plannerData.quickTasks[0];
                document.getElementById('quickTask2').value = plannerData.quickTasks[1];
                document.getElementById('quickTask3').value = plannerData.quickTasks[2];
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
                items = savedData.quickTasks.filter(task => task.trim() !== '');
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
        if (item.trim() === '') return;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'saved-item';
        
        const textElement = document.createElement('span');
        textElement.textContent = item;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        deleteBtn.title = 'Remover';
        deleteBtn.addEventListener('click', () => {
            removeItem(section, index);
        });
        
        itemElement.appendChild(textElement);
        itemElement.appendChild(deleteBtn);
        listElement.appendChild(itemElement);
    });
}

function removeItem(section, index) {
    const savedData = JSON.parse(localStorage.getItem('dailyPlannerData')) || {};
    
    switch(section) {
        case 'priorities':
            savedData.priorities = '';
            break;
        case 'quickTasks':
            if (savedData.quickTasks && savedData.quickTasks.length > index) {
                savedData.quickTasks[index] = '';
                document.getElementById(`quickTask${index + 1}`).value = '';
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
    const quickTasks = [
        document.getElementById('quickTask1').value,
        document.getElementById('quickTask2').value,
        document.getElementById('quickTask3').value
    ].filter(task => task.trim() !== '');

    quickTasks.forEach((task, index) => {
        tasks.push({
            title: task,
            description: 'Tarefa rápida',
            startTime: `${selectedDate}T10:00:00`,
            endTime: `${selectedDate}T10:30:00`
        });
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

function formatDateForGoogleCalendar(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
}