document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // clear all tasks that are completed
    const clearCompletedBtn = document.createElement('button');
    clearCompletedBtn.textContent = 'Clear Completed';
    clearCompletedBtn.className = 'clear-completed-btn';
    document.querySelector('.container').appendChild(clearCompletedBtn);

    // get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        clearCompletedBtn.style.display = tasks.some(task => task.completed) ? 'block' : 'none';
    };


    // add new task
    const addTask = (text) => {
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
            <span class="task-text">${task.text}</span>
            <button class="done-btn">${task.completed ? 'Undo' : 'Mark as Done'}</button>
            <button class="delete-btn">Delete</button>
        `;

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

    addTaskButton.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = taskInput.value.trim();
            if (text) {
                addTask(text);
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