let tasks = loadTasks();

// ADD TASK
function addTask(event) {
    event.preventDefault();

    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let category = document.getElementById("category").value;
    let priority = document.getElementById("priority").value;
    let dueDate = document.getElementById("dueDate").value;

    let task = {
        id: Date.now(),
        title,
        description,
        category,
        priority,
        dueDate,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(task);
    saveTasks(tasks);

    renderTasks();
    clearForm();
}

// RENDER TASKS (Day 3)
function renderTasks() {
    let container = document.getElementById("taskList");
    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = "<p>No tasks available</p>";
        return;
    }

    tasks.forEach(task => {
        let div = document.createElement("div");
        div.className = "task-card";

        if (task.completed) {
            div.classList.add("completed");
        }

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>

            <span class="badge">${task.category}</span>
            <span class="badge priority-${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <p>📅 ${task.dueDate}</p>

            <button onclick="toggleTask(${task.id})">✔</button>
            <button onclick="deleteTask(${task.id})">❌</button>
        `;

        container.appendChild(div);
    });
}

// TOGGLE COMPLETE
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );

    saveTasks(tasks);
    renderTasks();
}

// DELETE TASK
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks(tasks);
    renderTasks();
}

// CLEAR FORM
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("dueDate").value = "";
}

// LOAD ON START
renderTasks();
