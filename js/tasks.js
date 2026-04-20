let tasks = loadTasks();
let editId = null; // 🔥 important for editing

// HANDLE FORM SUBMIT
function handleSubmit(event) {
    event.preventDefault();

    if (editId) {
        updateTask();
    } else {
        addTask();
    }
}

// ADD TASK
function addTask() {
    let task = getFormData();

    task.id = Date.now();
    task.completed = false;
    task.createdAt = new Date().toLocaleString();

    tasks.push(task);
    saveTasks(tasks);

    renderTasks();
    clearForm();
}

// UPDATE TASK
function updateTask() {
    let updatedTask = getFormData();

    tasks = tasks.map(task =>
        task.id === editId ? { ...task, ...updatedTask } : task
    );

    saveTasks(tasks);

    editId = null;
    document.getElementById("submitBtn").innerText = "Add Task";

    renderTasks();
    clearForm();
}

// GET FORM DATA
function getFormData() {
    return {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        priority: document.getElementById("priority").value,
        dueDate: document.getElementById("dueDate").value
    };
}

// RENDER TASKS
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
            <div class="task-top">
                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})">

                <h3>${task.title}</h3>
            </div>

            <p>${task.description}</p>

            <span class="badge">${task.category}</span>
            <span class="badge priority-${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <p>📅 ${task.dueDate}</p>

            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;

        container.appendChild(div);
    });
}

// EDIT TASK (🔥 MAIN FEATURE)
function editTask(id) {
    let task = tasks.find(t => t.id === id);

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("category").value = task.category;
    document.getElementById("priority").value = task.priority;
    document.getElementById("dueDate").value = task.dueDate;

    editId = id;

    document.getElementById("submitBtn").innerText = "Update Task";
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