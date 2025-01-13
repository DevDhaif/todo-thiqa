document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const errorMessage = document.getElementById('error-message');
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
        document.body.classList.toggle('dark-theme', storedTheme === 'dark');
        themeToggle.textContent = storedTheme === 'dark' ? '☀️' : '🌙';
    } else if (prefersDark) {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });

    // clear all tasks that are completed
    const clearCompletedBtn = document.createElement('button');
    clearCompletedBtn.textContent = 'Clear Completed';
    clearCompletedBtn.className = 'clear-completed-btn';
    document.querySelector('.container').appendChild(clearCompletedBtn);

    // get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Show error message
    const showError = () => {
        errorMessage.style.display = 'block';
        taskInput.classList.add('invalid');

        // Hide error after 3 seconds
        setTimeout(() => {
            hideError();
        }, 3000);
    };

    // Hide error message
    const hideError = () => {
        errorMessage.style.display = 'none';
        taskInput.classList.remove('invalid');
    };

    // save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        clearCompletedBtn.style.display = tasks.some(task => task.completed) ? 'block' : 'none';
    };


    // add new task
    const addTask = (text) => {
        if (!text.trim()) {
            showError();
            return;
        }
        hideError();
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(task);
        taskList.appendChild(createTaskElement(task));
        saveTasks();
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
        <div class="task-content">
            <span class="task-text" data-id="${task.id}">${task.text}</span>
            <div class="task-buttons">
                <button class="edit-btn">Edit</button>
                <button class="done-btn">${task.completed ? 'Undo' : 'Mark as Done'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `;

        // edit task
        li.querySelector('.edit-btn').addEventListener('click', () => {

            const taskText = li.querySelector('.task-text');
            const currentText = taskText.textContent;
            taskText.innerHTML = `<input type="text" value="${currentText}">`;
            const input = taskText.querySelector('input');
            input.focus();

            input.addEventListener('blur', finishEditing);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') finishEditing();
            });

            function finishEditing() {
                const newText = input.value.trim();
                if (newText && newText !== currentText) {
                    task.text = newText;
                    saveTasks();
                }
                taskText.textContent = task.text;
            }
            input.addEventListener('blur', finishEditing);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') finishEditing();
            });
        });

        // mark task as done
        li.querySelector('.done-btn').addEventListener('click', (e) => {
            task.completed = !task.completed;
            li.classList.toggle('completed');
            e.target.textContent = task.completed ? 'Undo' : 'Mark as Done';
            saveTasks();
        });

        // delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            li.remove();
            saveTasks();
        });

        return li;
    };

    // hide error when user typing
    taskInput.addEventListener('input', hideError);

    addTaskButton.addEventListener('click', () => {
        const text = taskInput.value.trim();
        addTask(text);
        if (text) {
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = taskInput.value.trim();
            addTask(text);
            if (text) {
                taskInput.value = '';
            }
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
        saveTasks();
    });

    // load the saved tasks when the page load
    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
    };

    renderTasks();
});