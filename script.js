document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // add new task
    const addTask = (text) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text">${text}</span>
            <button class="done-btn">Mark as Done</button>
            <button class="delete-btn">Delete</button>
        `;

        // mark task as done
        li.querySelector('.done-btn').addEventListener('click', (e) => {
            li.classList.toggle('completed');
            e.target.textContent = li.classList.contains('completed') ? 'Undo' : 'Mark as Done';
        });
        // delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
        });

        taskList.appendChild(li);
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
});