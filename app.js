document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearBtn = document.getElementById('clearBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getFilteredTasks() {
        if (currentFilter === 'active') return tasks.filter(t => !t.completed);
        if (currentFilter === 'completed') return tasks.filter(t => t.completed);
        return tasks;
    }

    function renderTasks() {
        const filtered = getFilteredTasks();
        taskList.innerHTML = '';

        if (filtered.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.textContent = 'No tasks here yet 🌌';
            taskList.appendChild(empty);
        } else {
            filtered.forEach((task, idx) => {
                const originalIndex = tasks.indexOf(task);
                const li = document.createElement('li');
                li.className = 'task-item' + (task.completed ? ' completed' : '');
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'task-checkbox';
                cb.checked = task.completed;
                cb.addEventListener('change', () => toggleTask(originalIndex));
                
                const span = document.createElement('span');
                span.className = 'task-text';
                span.textContent = task.text;
                
                const del = document.createElement('button');
                del.className = 'delete-btn';
                del.innerHTML = '×';
                del.addEventListener('click', () => deleteTask(originalIndex));
                
                li.appendChild(cb);
                li.appendChild(span);
                li.appendChild(del);
                taskList.appendChild(li);
            });
        }
        updateCount();
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;
        tasks.push({ text, completed: false, id: Date.now() });
        saveTasks();
        taskInput.value = '';
        renderTasks();
        taskInput.focus();
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function updateCount() {
        const active = tasks.filter(t => !t.completed).length;
        taskCount.textContent = active + ' item' + (active !== 1 ? 's' : '') + ' left';
    }

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    clearBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    renderTasks();
});
