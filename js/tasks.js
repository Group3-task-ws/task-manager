let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("taskForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const desc = document.getElementById("desc").value.trim();
        const category = document.getElementById("category").value;
        const priority = document.getElementById("priority").value;
        const dueDate = document.getElementById("dueDate").value;

        if (!title || !desc || !dueDate) {
            alert("Fill all fields");
            return;
        }

        const newTask = {
            id: Date.now(),
            title,
            description: desc,
            category,
            priority,
            dueDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();

        form.reset();
        renderTasks();
    });

    renderTasks();
});


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    if (tasks.length === 0) {
        list.innerHTML = "<p>No tasks</p>";
        updateStats();
        return;
    }

    tasks.forEach(task => {

        const div = document.createElement("div");
        div.className = "task-card";

        if (task.completed) div.classList.add("completed");
        if (!task.completed && task.dueDate < today) div.classList.add("overdue");

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <small>${task.category} | ${task.priority}</small><br>
            <small>Due: ${task.dueDate}</small>

            <br><br>
            <button onclick="toggleComplete(${task.id})">✔</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
        `;

        list.appendChild(div);
    });

    updateStats();
}


function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}


function toggleComplete(id) {
    tasks = tasks.map(t => {
        if (t.id === id) t.completed = !t.completed;
        return t;
    });

    saveTasks();
    renderTasks();
}


/* DASHBOARD */
function updateStats() {

    const today = new Date().toISOString().split("T")[0];

    let total = tasks.length;
    let completedToday = 0;
    let pending = 0;
    let overdue = 0;

    tasks.forEach(task => {

        if (task.completed) {
            if (task.dueDate === today) completedToday++;
        } else {
            pending++;
        }

        if (!task.completed && task.dueDate < today) {
            overdue++;
        }
    });

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedToday").innerText = completedToday;
    document.getElementById("pendingTasks").innerText = pending;
    document.getElementById("overdueTasks").innerText = overdue;
}